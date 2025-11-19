import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export interface Associate {
  id: string;
  name: string;
  current_role: string;
  department: string;
  unit: string;
  location: string;
  sfia_rating: string;
  status: string;
  email: string;
  phone?: string | null;
  teams_link: string;
  avatar_url?: string | null;
  key_skills: string[];
  summary?: string | null;
  bio: string;
}

interface AssociateCardProps {
  associate: Associate;
  onViewProfile: (associate: Associate) => void;
}

// Helper to truncate text to ~20 words
const truncateToWords = (text: string, maxWords: number = 20): string => {
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
};

// Helper to get initials
const getInitials = (name: string): string => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const AssociateCard: React.FC<AssociateCardProps> = ({ associate, onViewProfile }) => {
  const summary = associate.summary 
    ? truncateToWords(associate.summary, 20)
    : truncateToWords(associate.bio, 20);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-5 flex flex-col h-full transition-all hover:shadow-xl hover:-translate-y-1">
      {/* Avatar */}
      <div className="flex items-center gap-3 mb-4">
        {associate.avatar_url ? (
          <img
            src={associate.avatar_url}
            alt={associate.name}
            className="h-16 w-16 rounded-full object-cover flex-shrink-0"
            onError={(e) => {
              // Fallback to initials if image fails
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'h-16 w-16 rounded-full bg-gradient-to-br from-[#FB5535] via-[#1A2E6E] to-[#030F35] flex items-center justify-center text-white font-semibold text-lg flex-shrink-0';
                fallback.textContent = getInitials(associate.name);
                parent.insertBefore(fallback, target);
              }
            }}
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#FB5535] via-[#1A2E6E] to-[#030F35] flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
            {getInitials(associate.name)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{associate.name}</h3>
          <p className="text-sm text-gray-600 truncate">{associate.current_role}</p>
        </div>
      </div>

      {/* Unit + Location */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <MapPin size={14} className="flex-shrink-0" />
        <span className="truncate">{associate.unit}</span>
        <span>•</span>
        <span className="truncate">{associate.location}</span>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-700 mb-4 line-clamp-3 flex-grow">
        {summary}
      </p>

      {/* Contact Info Box */}
      <div className="bg-[#F7F7F8] rounded-lg p-3 mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-gray-600 flex-shrink-0" />
          <a
            href={`mailto:${associate.email}`}
            className="text-sm text-gray-700 hover:text-indigo-600 truncate"
          >
            {associate.email}
          </a>
        </div>
        {associate.phone && (
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-gray-600 flex-shrink-0" />
            <a
              href={`tel:${associate.phone}`}
              className="text-sm text-gray-700 hover:text-indigo-600"
            >
              {associate.phone}
            </a>
          </div>
        )}
      </div>

      {/* View Profile Button */}
      <button
        onClick={() => onViewProfile(associate)}
        className="w-full bg-[#030F35] hover:bg-[#051040] text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-auto"
      >
        View Profile
      </button>
    </div>
  );
};

