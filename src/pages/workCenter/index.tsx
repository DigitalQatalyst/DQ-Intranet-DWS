import React, { useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HomeIcon, ChevronRightIcon } from 'lucide-react';
import { SearchBar } from '../../components/SearchBar';
import { SessionsPage } from './SessionsPage';
import { TasksPage } from './TasksPage';
import { TrackersPage } from './TrackersPage';

type TabType = 'sessions' | 'tasks' | 'trackers';

export const WorkCenterPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeTab = (searchParams.get('tab') || 'sessions') as TabType;

  const handleTabChange = useCallback((tab: TabType) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const tabs = [
    { id: 'sessions' as TabType, label: 'Sessions' },
    { id: 'tasks' as TabType, label: 'Tasks' },
    { id: 'trackers' as TabType, label: 'Trackers' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 inline-flex items-center"
              >
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">work center</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Title and Description */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Work Center</h1>
        <p className="text-gray-600 mb-6">
          Centralized platform for managing sessions, tasks, and trackers across projects and teams.
        </p>

        {/* Tab Overview Pill - Always visible above navigation */}
        <div className="mb-4">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
            <span className="text-sm font-medium text-blue-700">
              {activeTab === 'sessions' && 'Sessions: View and manage recurring organizational sessions'}
              {activeTab === 'tasks' && 'Tasks: Manage projects and work items across teams'}
              {activeTab === 'trackers' && 'Trackers: Track features and deliverables in Excel-like format'}
            </span>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'sessions' && <SessionsPage searchQuery={searchQuery} />}
          {activeTab === 'tasks' && <TasksPage searchQuery={searchQuery} />}
          {activeTab === 'trackers' && <TrackersPage searchQuery={searchQuery} />}
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );
};

