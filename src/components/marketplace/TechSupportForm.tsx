import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, Upload, Cloud } from 'lucide-react';

import { supabase } from '@/lib/supabaseClient';
import ConfirmationModal from './ConfirmationModal';

interface TechSupportFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadedFile {
  file: File;
  name: string;
  size: number;
}

const MAX_DESCRIPTION_LENGTH = 2000;

const CATEGORY_OPTIONS = [
  'Tech - Microsoft Solutions',
  'Tech - Devices',
  'Tech - Other Solutions',
] as const;

type CategoryOption = (typeof CATEGORY_OPTIONS)[number];

const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'] as const;
type PriorityOption = (typeof PRIORITY_OPTIONS)[number];

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Generate unique Ticket Number for each submission
// Format: TSR-YYYYMMDD-XXXX (e.g., TSR-20260115-A7B3)
const generateTicketNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePart = `${year}${month}${day}`;

  // Generate 4-character alphanumeric code
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return `TSR-${datePart}-${randomPart}`;
};

// Generate current timestamp in TIMESTAMPTZ format
// Format: YYYY-MM-DDTHH:MM:SS.sss+00:00
const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Upload files to Supabase Storage
const uploadFilesToStorage = async (
  files: UploadedFile[],
  ticketNumber: string
): Promise<string[]> => {
  const uploadedUrls: string[] = [];

  for (const uploadedFile of files) {
    const { file } = uploadedFile;
    // Create unique file path: ticket-number/original-filename
    const filePath = `${ticketNumber}/${file.name}`;

    const { data, error } = await supabase.storage
      .from('tech-support-attachments')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload file ${file.name}: ${error.message}`);
    }

    // Get public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from('tech-support-attachments').getPublicUrl(data.path);

    uploadedUrls.push(publicUrl);
  }

  return uploadedUrls;
};

// Supabase table insert payload interface
interface TechSupportRequestPayload {
  ticket_number: string;
  email: string;
  selected_category: string;
  issue_description: string;
  priority: string;
  created_at: string;
  attachment_urls?: string[];
}

export function TechSupportForm({ isOpen, onClose }: TechSupportFormProps) {
  const [email, setEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | ''>('');
  const [issueDescription, setIssueDescription] = useState('');
  const [priority, setPriority] = useState<PriorityOption>('Medium');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedTicketNumber, setSubmittedTicketNumber] = useState<string | null>(null);

  useEffect(() => {
    const isValid =
      isValidEmail(email) &&
      selectedCategory !== '' &&
      issueDescription.trim().length > 0 &&
      issueDescription.trim().length <= MAX_DESCRIPTION_LENGTH;

    setIsFormValid(isValid);
  }, [email, selectedCategory, issueDescription]);

  // Reset state when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setSelectedCategory('');
      setIssueDescription('');
      setPriority('Medium');
      setUploadedFiles([]);
      setIsFormValid(false);
      setShowConfirmation(false);
      setIsSubmitting(false);
      setSubmitError(null);
      setSubmittedTicketNumber(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const mappedFiles: UploadedFile[] = files.map((file) => ({
      file,
      name: file.name,
      size: file.size,
    }));

    setUploadedFiles(mappedFiles);
  };

  const submitTechSupportRequest = async (payload: TechSupportRequestPayload): Promise<void> => {
    const { data, error } = await supabase
      .from('tech_support_requests')
      .insert([payload])
      .select();

    if (error) {
      throw new Error(`Failed to submit request: ${error.message}`);
    }

    // eslint-disable-next-line no-console
    console.log('Tech support request created:', data);
  };

  const notifyUserViaPowerAutomate = async (payload: {
    email: string;
    created_at: string;
    ticket_number: string;
    selected_category: string;
    priority: string;
  }): Promise<void> => {
    const powerAutomateUrl = import.meta.env.VITE_POWER_AUTOMATE_EMAIL_NOTIFICATION as string;

    if (!powerAutomateUrl) {
      // eslint-disable-next-line no-console
      console.warn('Power Automate URL not configured. Skipping email notification.');
      return;
    }

    try {
      const response = await fetch(powerAutomateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Power Automate notification failed: ${response.statusText}`);
      }

      // eslint-disable-next-line no-console
      console.log('User notification sent via Power Automate');
    } catch (error) {
      // Log error but don't fail the entire submission if notification fails
      // eslint-disable-next-line no-console
      console.error('Failed to send Power Automate notification:', error);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    // Reset error state
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // Generate unique Ticket Number for this submission
      const ticketNumber = generateTicketNumber();

      // Upload files to Supabase Storage if any
      let attachmentUrls: string[] = [];
      if (uploadedFiles.length > 0) {
        attachmentUrls = await uploadFilesToStorage(uploadedFiles, ticketNumber);
      }

      // Map form data to Supabase table columns (snake_case)
      const payload: TechSupportRequestPayload = {
        ticket_number: ticketNumber,
        email: email.trim(),
        selected_category: selectedCategory as string,
        issue_description: issueDescription.trim(),
        priority,
        created_at: getCurrentTimestamp(),
        attachment_urls: attachmentUrls.length > 0 ? attachmentUrls : undefined,
      };

      await submitTechSupportRequest(payload);

      // Send notification via Power Automate
      await notifyUserViaPowerAutomate({
        email: email.trim(),
        created_at: getCurrentTimestamp(),
        ticket_number: ticketNumber,
        selected_category: selectedCategory as string,
        priority,
      });

      // Success - store Ticket Number and show confirmation
      setSubmittedTicketNumber(ticketNumber);
      setShowConfirmation(true);
    } catch (error) {
      // Handle error
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while submitting your request. Please try again.';
      setSubmitError(errorMessage);
      // eslint-disable-next-line no-console
      console.error('Tech support submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  const remainingCharacters = MAX_DESCRIPTION_LENGTH - issueDescription.length;

  // MODAL POSITIONING NOTE:
  // The modal uses 'fixed' positioning to create a proper overlay that covers the entire viewport.
  // This is required for modal overlays to work correctly - 'absolute' positioning won't create
  // a proper full-screen overlay.
  //
  // If you need non-sticky behavior (modal scrolls with page), you would need to:
  // 1. Change the modal from an overlay to an in-page component
  // 2. Remove the backdrop and positioning
  // 3. Integrate it into the page flow instead of using a modal pattern
  //
  // Current implementation: 'fixed' positioning (required for modal overlay functionality)

  return (
    <>
      {/* Form Modal - only show when confirmation is not showing */}
      {!showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-[800px] bg-white rounded-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-2">
          <div className="flex gap-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#030F35' }}
            >
              <Upload className="text-white w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">
                  Technology Support Request
                </h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Share what you need help with so the IT team can route and respond to your
                request quickly.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 sm:px-8 py-4 space-y-8">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
             1. Your Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your.email@example.com"
              className={`w-full bg-gray-100 border-none text-gray-700 p-4 rounded focus:outline-none focus:ring-2 transition-colors ${
                email && !isValidEmail(email)
                  ? 'focus:ring-red-500 border-red-300'
                  : 'focus:ring-indigo-500'
              }`}
            />
            {email && !isValidEmail(email) && (
              <p className="mt-1 text-xs text-red-600">
                Please enter a valid email address
              </p>
            )}
          </div>

          {/* Question 2: Category */}
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              2. What do you need help with? <span className="text-red-500">*</span>
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Select the most appropriate option
            </p>
            <div className="space-y-3">
              {CATEGORY_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    checked={selectedCategory === option}
                    onChange={() => setSelectedCategory(option)}
                  />
                  <span className="text-sm text-gray-800 group-hover:text-gray-900">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 2: Issue description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              3. What is the issue? <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Please provide as much detail as possible
            </p>
            <textarea
              value={issueDescription}
              onChange={(event) => setIssueDescription(event.target.value)}
              placeholder="Describe what you are experiencing, including any error messages, impacted tools or accounts."
              rows={4}
              maxLength={MAX_DESCRIPTION_LENGTH}
              className="w-full bg-gray-100 border-none text-gray-700 p-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none placeholder-gray-500"
            />
            <div className="mt-1 text-xs text-gray-400 text-right">
              {remainingCharacters} characters remaining
            </div>
          </div>

          {/* Question 4: Priority */}
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              4. Priority Level{' '}
              <span className="text-xs text-gray-500">(Optional)</span>
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Select the urgency of your request
            </p>
            <div className="flex gap-3">
              {PRIORITY_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`flex items-center justify-center px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                    priority === option
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={priority === option}
                    onChange={() => setPriority(option)}
                  />
                  <span className="text-sm font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 5: Upload files */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              5. Do you want to add any screenshots?{' '}
              <span className="text-xs text-gray-500">(Optional)</span>
            </label>
            <p className="text-xs text-gray-500 mb-4">
              Add screenshots of error messages or any other relevant images
            </p>
            
            {/* Modern Rounded Rectangle Upload Zone */}
            <label className="relative inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-200 group">
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFilesChange}
              />
              <div className="flex items-center gap-2">
                {/* Cloud Icon */}
                <Cloud className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" strokeWidth={1.5} fill="none" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                  Upload Files
                </span>
              </div>
            </label>
            
            {/* File Requirements
            <div className="mt-4 text-xs text-gray-400 text-center">
              File number limit: 2 · Single file size limit: 10MB · Allowed file types:
              Word, Excel, PPT, PDF, Image, Video, Audio
            </div> */}
            
            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-gray-600 mb-2">Uploaded files:</p>
                <ul className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <li key={file.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Upload className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800 font-medium">Submission Error</p>
              <p className="text-sm text-red-600 mt-1">{submitError}</p>
            </div>
          )}

          {/* Spacer */}
          <div className="h-4" />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 flex items-center justify-between bg-white">
          <button
            onClick={onClose}
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <button
            disabled={!isFormValid || isSubmitting}
            onClick={handleSubmit}
            className={`px-8 py-2 rounded font-medium transition-all ${
              isFormValid && !isSubmitting
                ? 'text-white shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            style={isFormValid && !isSubmitting ? { backgroundColor: '#030F35' } : {}}
            onMouseEnter={(event) => {
              if (isFormValid && !isSubmitting) {
                event.currentTarget.style.backgroundColor = '#020a23';
              }
            }}
            onMouseLeave={(event) => {
              if (isFormValid && !isSubmitting) {
                event.currentTarget.style.backgroundColor = '#030F35';
              }
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        title="Request has been submitted!"
        message="Your technology support request has been sent. The IT team will review it and follow up with you."
        ticketNumber={submittedTicketNumber}
      />
    </>
  );
}


