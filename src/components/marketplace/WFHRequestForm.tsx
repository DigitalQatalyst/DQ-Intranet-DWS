import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, Home } from 'lucide-react';
import { User } from '../../utils/types';
import ApproverList from './ApproverList';
import ConfirmationModal from './ConfirmationModal';
import { submitWFHRequestWithApprovers, fetchActiveApprovers } from '../../lib/wfhRequestService';
import { useAuth } from '../Header/context/AuthContext';

interface WFHRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialApprovers: User[];
}

const WFHRequestForm: React.FC<WFHRequestFormProps> = ({ isOpen, onClose }) => {
  // Get authenticated user
  const { user } = useAuth();
  const userEmail = user?.email || '';

  const [requestName, setRequestName] = useState('');
  const [approvers, setApprovers] = useState<User[]>([]);
  const [wfhDate, setWfhDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [reason, setReason] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showApproverModal, setShowApproverModal] = useState(false);
  const [availableApprovers, setAvailableApprovers] = useState<User[]>([]);
  const [isLoadingApprovers, setIsLoadingApprovers] = useState(false);

  useEffect(() => {
    // Simple validation logic
    const isValid =
      requestName.trim().length > 0 &&
      wfhDate !== '' &&
      (!isMultiDay || endDate !== '') &&
      reason.trim().length > 0 &&
      approvers.length > 0 &&
      // Validate date range if multi-day: end date must be >= start date
      (!isMultiDay || !endDate || new Date(endDate) >= new Date(wfhDate));
    setIsFormValid(isValid);
  }, [requestName, wfhDate, endDate, isMultiDay, approvers, reason]);

  // Reset error when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Require authentication
  if (!userEmail) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-4">
            Please sign in to submit a WFH request.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-white rounded hover:bg-indigo-700 transition-colors"
            style={{ backgroundColor: '#030F35' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#020a23'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#030F35'}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleRemoveApprover = (id: string) => {
    setApprovers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleOpenApproverModal = async () => {
    setShowApproverModal(true);
    setIsLoadingApprovers(true);

    try {
      const approversFromDb = await fetchActiveApprovers();
      setAvailableApprovers(approversFromDb);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch approvers:', error);
      setAvailableApprovers([]);
    } finally {
      setIsLoadingApprovers(false);
    }
  };

  const handleAddApprover = (approver: User) => {
    // Check if approver is already added
    if (!approvers.find((a) => a.id === approver.id)) {
      setApprovers((prev) => [...prev, approver]);
    }
  };

  const handleCloseApproverModal = () => {
    setShowApproverModal(false);
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    // Validate email is present (from authentication)
    if (!userEmail || userEmail.trim().length === 0) {
      setSubmitError('Authentication required. Please sign in to submit a WFH request.');
      alert('You must be signed in to submit a WFH request. Please log in and try again.');
      return;
    }

    // Reset error state
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // Create the request payload for Supabase
      const payload = {
        request_name: requestName.trim(),
        wfh_date: wfhDate,
        end_date: isMultiDay ? endDate : undefined,
        reason: reason.trim(),
        submitted_by_email: userEmail.trim(),
        approvers,
      };

      // Submit to Supabase
      await submitWFHRequestWithApprovers(payload);

      // Show confirmation modal on success
      setShowConfirmation(true);
    } catch (error) {
      // Handle error
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.';

      setSubmitError(errorMessage);
      // eslint-disable-next-line no-console
      console.error('WFH request submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);

    // Reset form
    setRequestName('');
    setWfhDate('');
    setEndDate('');
    setIsMultiDay(false);
    setReason('');
    setApprovers([]);
    setSubmitError(null);

    // Close the request form
    onClose();
  };

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
            <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#030F35' }}>
               <Home className="text-white w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">HR | Work From Home Request</h2>

              </div>
              <p className="text-sm text-gray-500 mt-1">
                Submit your WFH request at least 24 hours in advance with approver selection, date(s), and justification.
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

          {/* Request Name Input */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Name of request <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              placeholder="Use a name that's easy to understand"
              className="w-full text-3xl font-light text-gray-800 placeholder-gray-300 border-b-2 border-indigo-600 py-2 focus:outline-none focus:border-indigo-800 transition-colors bg-transparent"
            />
          </div>

          {/* Authentication Warning Banner */}
          {!userEmail && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-yellow-600 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-yellow-800">Authentication Required</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    You must be signed in to submit a WFH request. Please log in to continue.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Approvers Section */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-3">
              Approvers <span className="text-red-500">*</span>
            </label>
            <ApproverList
              approvers={approvers}
              onRemove={handleRemoveApprover}
              onAdd={handleOpenApproverModal}
            />
            <p className="text-sm text-gray-500 mt-2">
              Require a response from one of approvers
            </p>
          </div>

          {/* Multi-Day Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="multiDay"
              checked={isMultiDay}
              onChange={(e) => setIsMultiDay(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="multiDay" className="text-sm font-medium text-gray-700">
              This is a multi-day WFH request
            </label>
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isMultiDay ? 'Start date' : 'WFH date'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={wfhDate}
                  onChange={(e) => setWfhDate(e.target.value)}
                  onClick={(e) => {
                    // Show date picker on click
                    try {
                      e.currentTarget.showPicker();
                    } catch (error) {
                      // Fallback for browsers that don't support showPicker()
                      e.currentTarget.focus();
                    }
                  }}
                  className="w-full bg-gray-100 border-none text-gray-700 py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                />
              </div>
            </div>

            {isMultiDay && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    min={wfhDate || undefined}
                    onChange={(e) => setEndDate(e.target.value)}
                    onClick={(e) => {
                      // Show date picker on click
                      try {
                        e.currentTarget.showPicker();
                      } catch (error) {
                        // Fallback for browsers that don't support showPicker()
                        e.currentTarget.focus();
                      }
                    }}
                    className="w-full bg-gray-100 border-none text-gray-700 py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Date Range Validation Error */}
          {isMultiDay && wfhDate && endDate && new Date(endDate) < new Date(wfhDate) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded -mt-4">
              <p className="text-sm">End date cannot be before start date</p>
            </div>
          )}

          {/* Reason Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for WFH request <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a valid and clear reason for working from home"
              rows={3}
              className="w-full bg-gray-100 border-none text-gray-700 p-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none placeholder-gray-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Note: Request must be submitted at least 24 hours in advance. Webcam must be turned on during WFH.
            </p>
          </div>

          {/* WFH Requirements Info Box */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
              <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: '#030F35' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Work From Home Requirements
              </h4>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Timezone Groups */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Dubai Time Zone */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-gray-300">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#030F35' }}>
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h5 className="text-sm font-bold text-gray-900">Dubai Time (UTC+4)</h5>
                  </div>

                  <div className="space-y-3">
                    {/* Login Time */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-gray-600">Login Time</span>
                      </div>
                      <span className="font-mono font-bold text-sm" style={{ color: '#030F35' }}>9:00 AM</span>
                    </div>



                    {/* End of Day */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-gray-600">Logout Time</span>
                      </div>
                      <span className="font-mono font-bold text-sm" style={{ color: '#030F35' }}>6:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Nairobi / KSA Time Zone */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-gray-300">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#030F35' }}>
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h5 className="text-sm font-bold text-gray-900">Nairobi / KSA (UTC+3)</h5>
                  </div>

                  <div className="space-y-3">
                    {/* Login Time */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-gray-600">Login Time</span>
                      </div>
                      <span className="font-mono font-bold text-sm" style={{ color: '#030F35' }}>8:00 AM</span>
                    </div>

                   

                    {/* Logout Time */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-gray-600">Logout Time</span>
                      </div>
                      <span className="font-mono font-bold text-sm" style={{ color: '#030F35' }}>5:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Requirements */}
              <div className="pt-4 mt-4 border-t border-gray-200 space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs text-gray-700">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#030F35' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="leading-relaxed">Webcam must be turned on for the entire duration of WFH</span>
                </div>
                                <div className="flex items-start gap-2.5 text-xs text-gray-700">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#030F35' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="leading-relaxed">Login to DQLive for the entirety of the working session.</span>
                </div>
              </div>
                <div className="flex items-start gap-2.5 text-xs text-gray-700">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#030F35' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="leading-relaxed">Remain active and responsive throughout the workday</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="text-sm">{submitError}</p>
            </div>
          )}

          {/* Spacing for bottom scroll */}
          <div className="h-4"></div>
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
            onMouseEnter={(e) => {
              if (isFormValid && !isSubmitting) {
                e.currentTarget.style.backgroundColor = '#020a23';
              }
            }}
            onMouseLeave={(e) => {
              if (isFormValid && !isSubmitting) {
                e.currentTarget.style.backgroundColor = '#030F35';
              }
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Send'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        title="Request has been submitted!"
        message="Your WFH request has been sent to the approvers. Remember to post in HR Channel and notify in Logistics once approved."
      />

      {/* Approver Selection Modal */}
      {showApproverModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCloseApproverModal}
          />

          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Select Approver</h3>
              <button
                onClick={handleCloseApproverModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingApprovers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Loading approvers...</div>
                </div>
              ) : availableApprovers.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">No approvers available</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableApprovers.map((approver) => {
                    const isAlreadyAdded = approvers.find((a) => a.id === approver.id);
                    return (
                      <button
                        key={approver.id}
                        onClick={() => {
                          handleAddApprover(approver);
                          handleCloseApproverModal();
                        }}
                        disabled={!!isAlreadyAdded}
                        className={`w-full flex items-center p-3 rounded-lg border transition-all ${
                          isAlreadyAdded
                            ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50'
                            : 'bg-white border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer'
                        }`}
                      >
                        {/* Avatar */}
                        <div className={`${approver.color} w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3`}>
                          {approver.initials}
                        </div>

                        {/* Name and Status */}
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-gray-900">{approver.name}</div>
                          {isAlreadyAdded && (
                            <div className="text-xs text-gray-500">Already added</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WFHRequestForm;
