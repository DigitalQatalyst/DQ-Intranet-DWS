import React from 'react';
import { Link } from 'react-router-dom';

interface DesignSystemCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];
  type: string;
}

export const DesignSystemCard: React.FC<DesignSystemCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  tags = [],
  type
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Hero Image */}
      <div className="w-full h-64 bg-gradient-to-br from-blue-900 via-blue-700 to-purple-600 relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* View Details Button */}
        <Link
          to={`/marketplace/design-system/${id}?tab=${type}`}
          className="w-full text-center px-6 py-3 bg-blue-950 text-white rounded-full font-semibold text-sm hover:bg-blue-900 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
