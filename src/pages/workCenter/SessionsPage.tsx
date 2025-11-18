import React, { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FilterSidebar, FilterConfig } from '../../components/marketplace/FilterSidebar';
import { FilterIcon, XIcon } from 'lucide-react';
import { SessionDetailsModal } from './components/SessionDetailsModal';

interface Session {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'retro' | 'cws' | 'onboarding' | 'scrum';
  department: string;
  location: string;
  attendees: string[];
  agenda: string[];
  description?: string;
  moderator: string;
}

// Department colors
const departmentColors: Record<string, { bg: string; border: string }> = {
  'HRA (People)': { bg: '#1A2E6E', border: '#1A2E6E' },
  'Finance': { bg: '#FB5535', border: '#FB5535' },
  'Deals': { bg: '#4CAF50', border: '#4CAF50' },
  'Stories': { bg: '#9C27B0', border: '#9C27B0' },
  'Intelligence': { bg: '#FF9800', border: '#FF9800' },
  'Solutions': { bg: '#00BCD4', border: '#00BCD4' },
  'SecDevOps': { bg: '#795548', border: '#795548' },
  'Products': { bg: '#607D8B', border: '#607D8B' },
  'Delivery - Deploys': { bg: '#E91E63', border: '#E91E63' },
  'Delivery - Designs': { bg: '#3F51B5', border: '#3F51B5' },
  'DCO Operations': { bg: '#009688', border: '#009688' },
  'DBP Platform': { bg: '#CDDC39', border: '#CDDC39' },
  'DBP Delivery': { bg: '#FF5722', border: '#FF5722' },
};

const moderators = [
  'Sreya Lakshmi',
  'Vishnu Chandran',
  'Fadil Alli',
  'Pelagie Njiki',
  'Agnes Sadera',
  'Lorenza Oduor',
];

const departments = [
  'HRA (People)',
  'Finance',
  'Deals',
  'Stories',
  'Intelligence',
  'Solutions',
  'SecDevOps',
  'Products',
  'Delivery - Deploys',
  'Delivery - Designs',
  'DCO Operations',
  'DBP Platform',
  'DBP Delivery',
];

const locations = ['Dubai', 'Nairobi', 'Riyadh', 'Remote'];

// Generate recurring sessions for each department
function generateRecurringSessions(): Session[] {
  const sessions: Session[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Generate sessions for the next 12 weeks
  for (let weekOffset = 0; weekOffset < 12; weekOffset++) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + (weekOffset * 7));
    
    departments.forEach((dept, deptIndex) => {
      // Each department has one session per type, attended by all locations
      const baseHour = 9 + (deptIndex % 4); // Different start times for each department
      const moderator = moderators[deptIndex % moderators.length];
      // Use first location as primary location, but all locations attend
      const primaryLocation = locations[deptIndex % locations.length];
      
      // CWS - Co-working session (Monday)
      const cwsDate = new Date(weekStart);
      cwsDate.setDate(weekStart.getDate() + (weekStart.getDay() === 0 ? 1 : (8 - weekStart.getDay()))); // Next Monday
      sessions.push({
        id: `cws-${dept}-${weekOffset}`,
        title: `CWS - ${dept}`,
        start: new Date(cwsDate.setHours(baseHour, 0, 0, 0)),
        end: new Date(cwsDate.setHours(baseHour + 2, 0, 0, 0)),
        type: 'cws',
        department: dept,
        location: primaryLocation,
        attendees: ['All Locations - Team Members'],
        agenda: ['Collaboration', 'Discussion', 'Planning'],
        description: `Weekly co-working session for ${dept} (attended by all locations)`,
        moderator: moderator,
      });
      
      // Retro - Sprint retrospective (Friday, after CWS)
      const retroDate = new Date(weekStart);
      retroDate.setDate(weekStart.getDate() + (weekStart.getDay() === 0 ? 5 : (12 - weekStart.getDay()))); // Next Friday
      sessions.push({
        id: `retro-${dept}-${weekOffset}`,
        title: `Retro - ${dept}`,
        start: new Date(retroDate.setHours(baseHour + 1, 0, 0, 0)),
        end: new Date(retroDate.setHours(baseHour + 2, 0, 0, 0)),
        type: 'retro',
        department: dept,
        location: primaryLocation,
        attendees: ['All Locations - Team Members'],
        agenda: ['What went well', 'What to improve', 'Action items'],
        description: `Weekly sprint retrospective for ${dept} (attended by all locations)`,
        moderator: moderator,
      });
      
      // Daily Scrum (Tuesday, Wednesday, Thursday) - attended by all locations
      for (let day = 1; day <= 3; day++) {
        const scrumDate = new Date(weekStart);
        scrumDate.setDate(weekStart.getDate() + (weekStart.getDay() === 0 ? day + 1 : (8 - weekStart.getDay() + day)));
        sessions.push({
          id: `scrum-${dept}-${weekOffset}-${day}`,
          title: `Daily Scrum - ${dept}`,
          start: new Date(scrumDate.setHours(9, 30, 0, 0)),
          end: new Date(scrumDate.setHours(10, 0, 0, 0)),
          type: 'scrum',
          department: dept,
          location: primaryLocation,
          attendees: ['All Locations - Dev Team', 'Product Owner'],
          agenda: ['What did you do?', 'What will you do?', 'Any blockers?'],
          description: `Daily standup meeting for ${dept} (attended by all locations)`,
          moderator: moderator,
        });
      }
      
      // Onboarding (Every 2 weeks on Wednesday)
      if (weekOffset % 2 === 0) {
        const onboardingDate = new Date(weekStart);
        onboardingDate.setDate(weekStart.getDate() + (weekStart.getDay() === 0 ? 3 : (10 - weekStart.getDay())));
        sessions.push({
          id: `onboarding-${dept}-${weekOffset}`,
          title: `Onboarding - ${dept}`,
          start: new Date(onboardingDate.setHours(10, 0, 0, 0)),
          end: new Date(onboardingDate.setHours(12, 0, 0, 0)),
          type: 'onboarding',
          department: dept,
          location: primaryLocation,
          attendees: ['All Locations - HR Team', 'Manager', 'New Hires'],
          agenda: ['Welcome session', 'Company overview', 'Tools introduction'],
          description: `Onboarding session for new team members in ${dept} (attended by all locations)`,
          moderator: moderator,
        });
      }
    });
  }
  
  return sessions;
}

const dummySessions = generateRecurringSessions();

interface SessionsPageProps {
  searchQuery: string;
}

export const SessionsPage: React.FC<SessionsPageProps> = ({ searchQuery }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [calendarView, setCalendarView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('dayGridMonth');

  // Parse filters from URL
  const departmentFilters = useMemo(() => {
    const dept = searchParams.get('department');
    return dept ? dept.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const sessionTypeFilters = useMemo(() => {
    const type = searchParams.get('sessionType');
    return type ? type.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const moderatorFilters = useMemo(() => {
    const mod = searchParams.get('moderator');
    return mod ? mod.split(',').filter(Boolean) : [];
  }, [searchParams]);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    let filtered = dummySessions;

    // Filter by department
    if (departmentFilters.length > 0) {
      filtered = filtered.filter(session =>
        departmentFilters.includes(session.department)
      );
    }

    // Filter by session type
    if (sessionTypeFilters.length > 0) {
      filtered = filtered.filter(session =>
        sessionTypeFilters.includes(session.type)
      );
    }

    // Filter by moderator
    if (moderatorFilters.length > 0) {
      filtered = filtered.filter(session =>
        moderatorFilters.includes(session.moderator)
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(query) ||
        session.description?.toLowerCase().includes(query) ||
        session.department.toLowerCase().includes(query) ||
        session.moderator.toLowerCase().includes(query)
      );
    }

    // Sort by date (nearest to latest)
    filtered.sort((a, b) => a.start.getTime() - b.start.getTime());

    return filtered;
  }, [departmentFilters, sessionTypeFilters, moderatorFilters, searchQuery]);

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    const current = new Set((newParams.get(filterType)?.split(',').filter(Boolean)) || []);
    
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }

    if (current.size > 0) {
      newParams.set(filterType, Array.from(current).join(','));
    } else {
      newParams.delete(filterType);
    }

    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const filterConfig: FilterConfig[] = useMemo(() => [
      {
        id: 'department',
        title: 'Department',
        options: departments.map(dept => ({ id: dept, name: dept })),
      },
      {
        id: 'sessionType',
      title: 'Session Type',
      options: [
        { id: 'retro', name: 'Retro' },
        { id: 'cws', name: 'CWS' },
        { id: 'onboarding', name: 'Onboarding' },
        { id: 'scrum', name: 'Scrum' },
      ],
    },
    {
      id: 'moderator',
      title: 'Moderator',
      options: moderators.map(mod => ({ id: mod, name: mod })),
    },
  ], []);

  const urlBasedFilters: Record<string, string[]> = useMemo(() => ({
    department: departmentFilters,
    sessionType: sessionTypeFilters,
    moderator: moderatorFilters,
  }), [departmentFilters, sessionTypeFilters, moderatorFilters]);

  // Format events for FullCalendar with department colors
  const formattedEvents = filteredSessions.map(session => {
    const colors = departmentColors[session.department] || { bg: '#1A2E6E', border: '#1A2E6E' };

    return {
      id: session.id,
      title: `${session.title} - ${session.location}`,
      start: session.start,
      end: session.end,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textColor: '#FFFFFF',
      extendedProps: {
        session: session,
      },
    };
  });

  const handleEventClick = (info: any) => {
    setSelectedSession(info.event.extendedProps.session);
  };

  const handleViewChange = (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') => {
    setCalendarView(view);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      retro: 'Retro',
      cws: 'CWS',
      onboarding: 'Onboarding',
      scrum: 'Scrum',
    };
    return labels[type] || type;
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Mobile filter toggle */}
      <div className="xl:hidden sticky top-16 z-20 bg-gray-50 py-2 shadow-sm">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 w-full justify-center"
            aria-expanded={showFilters}
            aria-controls="filter-sidebar"
          >
            <FilterIcon size={18} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          {Object.values(urlBasedFilters).some(f => Array.isArray(f) && f.length > 0) && (
            <button
              onClick={resetFilters}
              className="ml-2 text-blue-600 text-sm font-medium whitespace-nowrap px-3 py-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Filter sidebar - mobile/tablet */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 z-30 xl:hidden"
          onClick={() => setShowFilters(false)}
        >
          <div
            id="filter-sidebar"
            className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar
                filters={urlBasedFilters}
                filterConfig={filterConfig}
                onFilterChange={handleFilterChange}
                onResetFilters={resetFilters}
                isResponsive={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filter sidebar - desktop */}
      <div className="hidden xl:block xl:w-1/4">
        <div className="bg-white rounded-lg shadow p-4 sticky top-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            {Object.values(urlBasedFilters).some(f => Array.isArray(f) && f.length > 0) && (
              <button
                onClick={resetFilters}
                className="text-blue-600 text-sm font-medium"
              >
                Reset All
              </button>
            )}
          </div>
          <FilterSidebar
            filters={urlBasedFilters}
            filterConfig={filterConfig}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            isResponsive={false}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="xl:w-3/4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Sessions ({filteredSessions.length})
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleViewChange('dayGridMonth')}
              className={`px-3 py-1 text-sm rounded-md ${
                calendarView === 'dayGridMonth'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => handleViewChange('timeGridWeek')}
              className={`px-3 py-1 text-sm rounded-md ${
                calendarView === 'timeGridWeek'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => handleViewChange('timeGridDay')}
              className={`px-3 py-1 text-sm rounded-md ${
                calendarView === 'timeGridDay'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Day
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={calendarView}
            view={calendarView}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: '',
            }}
            events={formattedEvents}
            eventClick={handleEventClick}
            height="auto"
            aspectRatio={calendarView === 'timeGridDay' ? 1.5 : 1.8}
            dayMaxEvents={calendarView === 'dayGridMonth' ? 3 : true}
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short',
            }}
            eventClassNames="rounded-md overflow-hidden"
            dayCellClassNames="hover:bg-gray-50"
            eventDisplay="block"
            eventTextColor="#FFFFFF"
          />
        </div>

        {/* Department Legend */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Department Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {departments.map((dept) => {
              const colors = departmentColors[dept] || { bg: '#1A2E6E', border: '#1A2E6E' };
              return (
                <div key={dept} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: colors.bg }}
                  />
                  <span className="text-sm text-gray-700">{dept}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session list */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Upcoming Sessions</h3>
          <div className="space-y-3">
            {filteredSessions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sessions found</p>
            ) : (
              filteredSessions.slice(0, 10).map((session) => (
                <div
                  key={session.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{session.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {session.start.toLocaleDateString()} at{' '}
                        {session.start.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {getTypeLabel(session.type)}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                          {session.location}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                          {session.moderator}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <SessionDetailsModal
          session={selectedSession}
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
};
