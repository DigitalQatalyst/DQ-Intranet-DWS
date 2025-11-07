import React, { useState, useEffect, useRef } from "react";
import { X, ArrowLeft, Building2, MapPin, Phone, Mail, ExternalLink, BookOpen } from "lucide-react";
import type { LocationItem } from "../../api/MAPAPI";
import { MARKER_COLORS } from "./constants";

interface LocationModalProps {
  location: LocationItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ location, isOpen, onClose }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset description expansion when modal opens
      setShowFullDescription(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!location) return null;

  const color = MARKER_COLORS[location.type] || MARKER_COLORS.Default;
  // Knowledge Center button only shows for Client and Bank locations (both are client types)
  const isClientLocation = (location.type === "Client" || location.type === "Bank") && location.knowledgeCenterUrl;
  const description = location.description || "";
  const shouldTruncate = description.length > 200;
  const displayDescription = shouldTruncate && !showFullDescription
    ? description.substring(0, 200) + "..."
    : description;

  // Get category display name
  const getCategoryDisplay = () => {
    if (location.category) return location.category;
    switch (location.type) {
      case "Client":
        return "Client Partner";
      case "Bank":
        return "Financial Services";
      case "Authority":
        return "Regulatory Authority";
      case "Utility":
        return "Energy & Utilities";
      case "Headquarters":
        return "Corporate Office";
      default:
        return location.type;
    }
  };

  return (
    <div
      ref={modalRef}
      className={`absolute top-0 right-0 h-full w-full md:w-[420px] lg:w-[480px] bg-white shadow-2xl z-50 transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{
        borderRadius: "0 24px 24px 0",
        maxHeight: "100%",
        overflowY: "auto",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
    >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 shadow-sm">
          <button
            onClick={onClose}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Category Tag */}
          {location.category && (
            <div className="inline-flex items-center">
              <span
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: "#FB5535" }}
              >
                {getCategoryDisplay()}
              </span>
            </div>
          )}

          {/* Title */}
          <h2
            id="location-modal-title"
            className="text-3xl font-bold"
            style={{ color: "#030F35" }}
          >
            {location.name}
          </h2>

          {/* Key Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Building2 size={18} className="text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-600">Type:</span>
              <span className="text-sm font-semibold text-gray-900">{location.type}</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-600">Location:</span>
              <span className="text-sm font-semibold text-gray-900">
                {location.city}, {location.country}
              </span>
            </div>

            {location.contact && (
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">Phone:</span>
                <a
                  href={`tel:${location.contact.replace(/\s/g, "")}`}
                  className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {location.contact}
                </a>
              </div>
            )}

            {location.email && (
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">Email:</span>
                <a
                  href={`mailto:${location.email}`}
                  className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors break-all"
                >
                  {location.email}
                </a>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <div>
              <p className="text-gray-700 leading-relaxed">{displayDescription}</p>
              {shouldTruncate && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  {showFullDescription ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}

          {/* Services */}
          {location.services && location.services.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Services</h3>
              <div className="flex flex-wrap gap-2">
                {location.services.map((service, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Address */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Address:</strong> {location.address}, {location.city}, {location.country}
            </p>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="sticky bottom-0 px-6 py-5 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Knowledge Center Button - Only for Client locations */}
            {isClientLocation && location.knowledgeCenterUrl && (
              <a
                href={location.knowledgeCenterUrl}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <BookOpen size={20} />
                <span>Visit Knowledge Center</span>
              </a>
            )}

            {/* Website Button */}
            {location.website && (
              <a
                href={location.website}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm ${
                  isClientLocation && location.knowledgeCenterUrl
                    ? "flex-1 bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
                    : "flex-1 bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <ExternalLink size={20} />
                <span>Visit Website</span>
              </a>
            )}
          </div>
        </div>
    </div>
  );
};

export default LocationModal;

