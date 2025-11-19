import React, { useEffect } from 'react';
import { X, Mail, Phone, MapPin, ExternalLink, Building2, Award, Briefcase } from 'lucide-react';
import type { Associate } from './AssociateCard';

interface AssociateModalProps {
  associate: Associate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AssociateModal: React.FC<AssociateModalProps> = ({ associate, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !associate) return null;

  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-2xl md:max-w-[900px] w-full h-full md:h-auto md:max-h-[90vh] overflow-y-auto md:m-4"
        style={{
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-6 py-4 flex items-center justify-between">
          <h2 id="modal-title" className="text-xl font-bold text-gray-900">
            Associate Profile
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-1 space-y-4">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                {associate.avatar_url ? (
                  <img
                    src={associate.avatar_url}
                    alt={associate.name}
                    className="w-32 h-32 rounded-full object-cover mb-4"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-32 h-32 rounded-full bg-gradient-to-br from-[#FB5535] via-[#1A2E6E] to-[#030F35] flex items-center justify-center text-white font-bold text-2xl mb-4';
                        fallback.textContent = getInitials(associate.name);
                        parent.insertBefore(fallback, target);
                      }
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FB5535] via-[#1A2E6E] to-[#030F35] flex items-center justify-center text-white font-bold text-2xl mb-4">
                    {getInitials(associate.name)}
                  </div>
                )}
              </div>

              {/* Role Tag */}
              <div className="text-center">
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                  {associate.current_role}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-gray-500 flex-shrink-0" />
                  <a
                    href={`mailto:${associate.email}`}
                    className="text-gray-700 hover:text-indigo-600 truncate"
                  >
                    {associate.email}
                  </a>
                </div>
                {associate.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-gray-500 flex-shrink-0" />
                    <a
                      href={`tel:${associate.phone}`}
                      className="text-gray-700 hover:text-indigo-600"
                    >
                      {associate.phone}
                    </a>
                  </div>
                )}
                {associate.teams_link && (
                  <div className="flex items-center gap-2 text-sm">
                    <ExternalLink size={16} className="text-gray-500 flex-shrink-0" />
                    <a
                      href={associate.teams_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-indigo-600 truncate"
                    >
                      Teams Profile
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700">{associate.location}</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-2 space-y-6">
              {/* Name */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{associate.name}</h3>
              </div>

              {/* Bio */}
              {associate.bio && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    Bio
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{associate.bio}</p>
                </div>
              )}

              {/* Skills */}
              {associate.key_skills && associate.key_skills.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    Key Skills
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {associate.key_skills.map((skill, idx) => (
                      <li key={idx}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Unit & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    Unit
                  </h4>
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">{associate.unit}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    Department
                  </h4>
                  <span className="text-sm text-gray-600">{associate.department}</span>
                </div>
              </div>

              {/* SFIA Rating & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    SFIA Rating
                  </h4>
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">{associate.sfia_rating}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    Status
                  </h4>
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">{associate.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-xl font-semibold text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Close
            </button>
            {associate.teams_link && (
              <a
                href={associate.teams_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl text-white font-semibold text-sm transition-all bg-gradient-to-r from-[#030F35] to-[#FB5535] hover:opacity-90"
              >
                Open Teams
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

