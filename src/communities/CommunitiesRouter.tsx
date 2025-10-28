import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CommunityHome } from './CommunityHome';
import { CommunityList } from './CommunityList';

export function CommunitiesRouter() {
  return (
    <Routes>
      <Route path="/" element={<CommunityHome />} />
      <Route path="/communities" element={<CommunityList />} />
      <Route path="/*" element={<CommunityHome />} />
    </Routes>
  );
}