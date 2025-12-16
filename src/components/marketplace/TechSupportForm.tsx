import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, Upload } from 'lucide-react';

import ConfirmationModal from './ConfirmationModal';

interface TechSupportFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadedFile {
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

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export function TechSupportForm({ isOpen, onClose }: TechSupportFormProps) {
  const [email, setEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | ''>('');
  const [issueDescription, setIssueDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
      setUploadedFiles([]);
      setIsFormValid(false);
      setShowConfirmation(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const mappedFiles: UploadedFile[] = files.map((file) => ({
      name: file.name,
      size: file.size,
    }));

    setUploadedFiles(mappedFiles);
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    // For now we just show a confirmation message.
    // The actual submission can be wired to an API or integration later.
    // eslint-disable-next-line no-console
    console.log('Tech support request submitted', {
      email,
      selectedCategory,
      issueDescription,
      uploadedFiles,
    });

    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  const remainingCharacters = MAX_DESCRIPTION_LENGTH - issueDescription.length;

  return (
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

          {/* Question 3: Upload files */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              4. Do you want to add any screenshots?{' '}
              <span className="text-xs text-gray-500">(Optional)</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Add screenshots of error messages or any other relevant images
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload file</span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFilesChange}
                />
              </label>
              <div className="text-xs text-gray-400">
                File number limit: 2 · Single file size limit: 10MB · Allowed file types:
                Word, Excel, PPT, PDF, Image, Video, Audio
              </div>
            </div>
            {uploadedFiles.length > 0 && (
              <ul className="mt-3 space-y-1 text-xs text-gray-600">
                {uploadedFiles.map((file) => (
                  <li key={file.name} className="flex items-center justify-between">
                    <span className="truncate max-w-[70%]">{file.name}</span>
                    <span className="text-gray-400">
                      {(file.size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

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
            disabled={!isFormValid}
            onClick={handleSubmit}
            className={`px-8 py-2 rounded font-medium transition-all ${
              isFormValid
                ? 'text-white shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            style={isFormValid ? { backgroundColor: '#030F35' } : {}}
            onMouseEnter={(event) => {
              if (isFormValid) {
                event.currentTarget.style.backgroundColor = '#020a23';
              }
            }}
            onMouseLeave={(event) => {
              if (isFormValid) {
                event.currentTarget.style.backgroundColor = '#030F35';
              }
            }}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        title="Request has been submitted!"
        message="Your technology support request has been sent. The IT team will review it and follow up with you."
      />
    </div>
  );
}


