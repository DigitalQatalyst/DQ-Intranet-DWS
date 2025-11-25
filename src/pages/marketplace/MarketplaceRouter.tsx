import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AssetLibraryPage from '../assetLibrary';
import { MarketplacePage } from '../../components/marketplace/MarketplacePage';
import MarketplaceDetailsPage from './MarketplaceDetailsPage';
import ActivitiesPage from './ActivitiesPage';
import { getMarketplaceConfig } from '../../utils/marketplaceConfig';
import NewsPage from './NewsPage';
import NewsDetailPage from './NewsDetailPage';
export const MarketplaceRouter: React.FC = () => {
  // Get configurations for Service Center only
  const nonFinancialConfig = getMarketplaceConfig('non-financial');
  
  // State for bookmarked items
  const [bookmarkedItems, setBookmarkedItems] = useState<Record<string, string[]>>({
    'non-financial': []
  });
  
  // Toggle bookmark for an item
  const handleToggleBookmark = (marketplaceType: string, itemId: string) => {
    setBookmarkedItems(prev => {
      const currentItems = prev[marketplaceType] || [];
      const updatedItems = currentItems.includes(itemId) ? currentItems.filter(id => id !== itemId) : [...currentItems, itemId];
      return {
        ...prev,
        [marketplaceType]: updatedItems
      };
    });
  };
  
  return <Routes>
      {/* Services Center - Primary Active Marketplace */}
      <Route path="/services-center" element={<MarketplacePage marketplaceType="non-financial" title={nonFinancialConfig.title} description={nonFinancialConfig.description} promoCards={[]} />} />
      <Route path="/services-center/:itemId" element={<MarketplaceDetailsPage marketplaceType="non-financial" bookmarkedItems={bookmarkedItems['non-financial']} onToggleBookmark={itemId => handleToggleBookmark('non-financial', itemId)} />} />
      
      {/* News & Opportunities Marketplace */}
      <Route path="/news" element={<NewsPage />} />
      <Route path="/news/:id" element={<NewsDetailPage />} />
      <Route path="/opportunities" element={<NewsPage />} />
      <Route path="/opportunities/:id" element={<NewsDetailPage />} />
      
      {/* Asset Library */}
      <Route path="/asset-library" element={<AssetLibraryPage />} />
      <Route path="/marketplace/activities" element={<ActivitiesPage />} />
    </Routes>;
};

