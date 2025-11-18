import React, { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterSidebar, FilterConfig } from '../../components/marketplace/FilterSidebar';
import { FilterIcon, XIcon, Plus, ArrowLeft, BarChart3 } from 'lucide-react';
import { ProjectDashboard } from './components/ProjectDashboard';
import { TaskDetailPage } from './components/TaskDetailPage';
import { AddTaskModal } from './components/AddTaskModal';

interface WorkItem {
  id: string;
  title: string;
  assignedTo: string;
  state: 'new' | 'active' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  activityDate: Date;
  tags: string[];
  projectId: string;
  context?: string;
  purpose?: string;
  mvps?: string[];
  discussion?: string[];
  checklist?: Array<{ id: string; text: string; completed: boolean }>;
}

interface Project {
  id: string;
  name: string;
  department: string[];
  location: string[];
  workItems: WorkItem[];
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
}

// Dummy projects with at least 3 tasks each
const dummyProjects: Project[] = [
  {
    id: 'dq-dws',
    name: 'DQ DWS',
    department: ['Products'],
    location: ['Dubai'],
    status: 'in-progress',
    workItems: [
      {
        id: 'dq-dws-1',
        title: 'Implement user authentication system',
        assignedTo: 'John Doe',
        state: 'active',
        priority: 'high',
        activityDate: new Date(2025, 0, 10),
        tags: ['frontend', 'security'],
        projectId: 'dq-dws',
        context: 'Need secure authentication for DQ DWS platform',
        purpose: 'Enable secure user access with OAuth integration',
        mvps: ['Basic login flow', 'Password reset functionality', 'Session management'],
        discussion: ['Discuss OAuth integration with team', 'Review security requirements'],
        checklist: [
          { id: '1', text: 'Design auth flow', completed: true },
          { id: '2', text: 'Implement login', completed: false },
          { id: '3', text: 'Add password reset', completed: false },
        ],
      },
      {
        id: 'dq-dws-2',
        title: 'Update dashboard UI components',
        assignedTo: 'Jane Smith',
        state: 'new',
        priority: 'medium',
        activityDate: new Date(2025, 0, 12),
        tags: ['frontend', 'ui'],
        projectId: 'dq-dws',
        context: 'Modernize dashboard with new design system',
        purpose: 'Improve user experience with updated components',
        mvps: ['New card components', 'Updated charts', 'Responsive layout'],
      },
      {
        id: 'dq-dws-3',
        title: 'Optimize database queries',
        assignedTo: 'Mike Johnson',
        state: 'active',
        priority: 'high',
        activityDate: new Date(2025, 0, 8),
        tags: ['backend', 'database'],
        projectId: 'dq-dws',
        context: 'Database performance is slow',
        purpose: 'Improve query performance and reduce load times',
        mvps: ['Index optimization', 'Query caching', 'Connection pooling'],
      },
    ],
  },
  {
    id: 'kf-inc-03',
    name: 'KF Inc 03',
    department: ['Solutions'],
    location: ['Riyadh'],
    status: 'in-progress',
    workItems: [
      {
        id: 'kf-03-1',
        title: 'Setup CI/CD pipeline',
        assignedTo: 'Alice Brown',
        state: 'active',
        priority: 'high',
        activityDate: new Date(2025, 0, 15),
        tags: ['devops', 'ci-cd'],
        projectId: 'kf-inc-03',
        context: 'Need automated deployment process',
        purpose: 'Streamline deployment and reduce manual errors',
        mvps: ['GitHub Actions setup', 'Test automation', 'Deployment scripts'],
      },
      {
        id: 'kf-03-2',
        title: 'Implement API documentation',
        assignedTo: 'Bob Wilson',
        state: 'new',
        priority: 'medium',
        activityDate: new Date(2025, 0, 18),
        tags: ['documentation', 'api'],
        projectId: 'kf-inc-03',
        context: 'APIs need comprehensive documentation',
        purpose: 'Help developers understand API usage',
        mvps: ['Swagger setup', 'Endpoint documentation', 'Examples'],
      },
      {
        id: 'kf-03-3',
        title: 'Migrate legacy data',
        assignedTo: 'Sarah Davis',
        state: 'resolved',
        priority: 'high',
        activityDate: new Date(2025, 0, 5),
        tags: ['backend', 'migration'],
        projectId: 'kf-inc-03',
        context: 'Legacy system data needs migration',
        purpose: 'Preserve historical data in new system',
        mvps: ['Data mapping', 'Migration scripts', 'Validation'],
      },
    ],
  },
  {
    id: 'kf-inc-02',
    name: 'KF Inc 02',
    department: ['Products'],
    location: ['Dubai'],
    status: 'completed',
    workItems: [
      {
        id: 'kf-02-1',
        title: 'Build reporting dashboard',
        assignedTo: 'Tom Anderson',
        state: 'closed',
        priority: 'high',
        activityDate: new Date(2024, 11, 20),
        tags: ['frontend', 'analytics'],
        projectId: 'kf-inc-02',
        context: 'Need insights into business metrics',
        purpose: 'Provide real-time business intelligence',
        mvps: ['Chart components', 'Data aggregation', 'Export functionality'],
      },
      {
        id: 'kf-02-2',
        title: 'Implement user roles and permissions',
        assignedTo: 'Lisa Chen',
        state: 'closed',
        priority: 'medium',
        activityDate: new Date(2024, 11, 25),
        tags: ['backend', 'security'],
        projectId: 'kf-inc-02',
        context: 'Require role-based access control',
        purpose: 'Ensure proper access management',
        mvps: ['Role definitions', 'Permission system', 'Access checks'],
      },
      {
        id: 'kf-02-3',
        title: 'Performance testing and optimization',
        assignedTo: 'David Kim',
        state: 'closed',
        priority: 'medium',
        activityDate: new Date(2024, 11, 28),
        tags: ['testing', 'performance'],
        projectId: 'kf-inc-02',
        context: 'System needs performance validation',
        purpose: 'Ensure system meets performance requirements',
        mvps: ['Load testing', 'Performance metrics', 'Optimization'],
      },
    ],
  },
  {
    id: 'dfsa-skunk',
    name: 'DFSA Skunk',
    department: ['Intelligence'],
    location: ['Dubai'],
    status: 'in-progress',
    workItems: [
      {
        id: 'dfsa-1',
        title: 'Develop data analytics engine',
        assignedTo: 'Emma Watson',
        state: 'active',
        priority: 'high',
        activityDate: new Date(2025, 0, 14),
        tags: ['backend', 'analytics'],
        projectId: 'dfsa-skunk',
        context: 'Need advanced analytics capabilities',
        purpose: 'Enable data-driven decision making',
        mvps: ['Data processing', 'Analytics algorithms', 'API endpoints'],
      },
      {
        id: 'dfsa-2',
        title: 'Create data visualization components',
        assignedTo: 'Ryan Murphy',
        state: 'new',
        priority: 'medium',
        activityDate: new Date(2025, 0, 16),
        tags: ['frontend', 'visualization'],
        projectId: 'dfsa-skunk',
        context: 'Users need to visualize complex data',
        purpose: 'Make data insights accessible',
        mvps: ['Chart library', 'Custom visualizations', 'Interactive graphs'],
      },
      {
        id: 'dfsa-3',
        title: 'Implement data export functionality',
        assignedTo: 'Olivia Martinez',
        state: 'active',
        priority: 'low',
        activityDate: new Date(2025, 0, 17),
        tags: ['backend', 'export'],
        projectId: 'dfsa-skunk',
        context: 'Users need to export reports',
        purpose: 'Enable data portability',
        mvps: ['CSV export', 'PDF export', 'Excel export'],
      },
    ],
  },
  {
    id: 'dewa-skunk',
    name: 'DEWA Skunk',
    department: ['Solutions'],
    location: ['Dubai'],
    status: 'not-started',
    workItems: [
      {
        id: 'dewa-1',
        title: 'Setup project infrastructure',
        assignedTo: 'Chris Lee',
        state: 'new',
        priority: 'high',
        activityDate: new Date(2025, 1, 1),
        tags: ['devops', 'infrastructure'],
        projectId: 'dewa-skunk',
        context: 'New project needs infrastructure setup',
        purpose: 'Prepare environment for development',
        mvps: ['Cloud resources', 'Networking', 'Security groups'],
      },
      {
        id: 'dewa-2',
        title: 'Design system architecture',
        assignedTo: 'Priya Patel',
        state: 'new',
        priority: 'high',
        activityDate: new Date(2025, 1, 2),
        tags: ['architecture', 'design'],
        projectId: 'dewa-skunk',
        context: 'Need to define system structure',
        purpose: 'Ensure scalable and maintainable design',
        mvps: ['Architecture diagrams', 'Component design', 'API specifications'],
      },
      {
        id: 'dewa-3',
        title: 'Setup development environment',
        assignedTo: 'Alex Taylor',
        state: 'new',
        priority: 'medium',
        activityDate: new Date(2025, 1, 3),
        tags: ['devops', 'setup'],
        projectId: 'dewa-skunk',
        context: 'Developers need local environment',
        purpose: 'Enable efficient development workflow',
        mvps: ['Docker setup', 'Local database', 'Dev tools'],
      },
    ],
  },
];

interface TasksPageProps {
  searchQuery: string;
}

type ViewType = 'list' | 'dashboard';

export const TasksPage: React.FC<TasksPageProps> = ({ searchQuery }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [viewType, setViewType] = useState<ViewType>('list');

  const selectedProjectId = searchParams.get('project');
  const selectedTaskId = searchParams.get('task');

  // Parse filters from URL
  const departmentFilters = useMemo(() => {
    const dept = searchParams.get('department');
    return dept ? dept.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const locationFilters = useMemo(() => {
    const loc = searchParams.get('location');
    return loc ? loc.split(',').filter(Boolean) : [];
  }, [searchParams]);

  // If task is selected, show task detail page
  if (selectedTaskId && selectedProjectId) {
    const project = dummyProjects.find(p => p.id === selectedProjectId);
    const task = project?.workItems.find(t => t.id === selectedTaskId);
    if (task) {
      return (
        <TaskDetailPage
          task={task}
          project={project!}
          onBack={() => {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('task');
            setSearchParams(newParams, { replace: true });
          }}
        />
      );
    }
  }

  // If project is selected, show project work items
  const selectedProject = selectedProjectId
    ? dummyProjects.find(p => p.id === selectedProjectId)
    : null;

  if (selectedProject) {
    // Filter work items
    const filteredWorkItems = useMemo(() => {
      let items = selectedProject.workItems;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        items = items.filter(item =>
          item.title.toLowerCase().includes(query) ||
          item.assignedTo.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      return items;
    }, [selectedProject.workItems, searchQuery]);

    return (
      <div>
        {/* Back button and project header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('project');
              setSearchParams(newParams, { replace: true });
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProject.name}</h2>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>Status: <span className="font-medium capitalize">{selectedProject.status}</span></span>
            <span>•</span>
            <span>{selectedProject.workItems.length} work items</span>
          </div>
        </div>

        {/* View tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setViewType('list')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                viewType === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Work Items
            </button>
            <button
              onClick={() => setViewType('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                viewType === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 size={16} />
              Dashboard
            </button>
          </nav>
        </div>

        {viewType === 'dashboard' ? (
          <ProjectDashboard project={selectedProject} />
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Work Items ({filteredWorkItems.length})
              </h3>
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                Add Work Item
              </button>
            </div>

            <div className="space-y-3">
              {filteredWorkItems.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">No work items found</p>
                </div>
              ) : (
                filteredWorkItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('task', item.id);
                      setSearchParams(newParams, { replace: true });
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <span>Assigned to: {item.assignedTo}</span>
                          <span>•</span>
                          <span className="capitalize">{item.state}</span>
                          <span>•</span>
                          <span>{item.activityDate.toLocaleDateString()}</span>
                        </div>
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          item.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : item.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {item.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {showAddTask && (
          <AddTaskModal
            projects={[selectedProject]}
            isOpen={showAddTask}
            onClose={() => setShowAddTask(false)}
          />
        )}
      </div>
    );
  }

  // Show projects list
  const filteredProjects = useMemo(() => {
    let filtered = dummyProjects;

    if (departmentFilters.length > 0) {
      filtered = filtered.filter(project =>
        project.department.some(dept => departmentFilters.includes(dept))
      );
    }

    if (locationFilters.length > 0) {
      filtered = filtered.filter(project =>
        project.location.some(loc => locationFilters.includes(loc))
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [departmentFilters, locationFilters, searchQuery]);

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
      options: [
        { id: 'HRA (People)', name: 'HRA (People)' },
        { id: 'Finance', name: 'Finance' },
        { id: 'Deals', name: 'Deals' },
        { id: 'Stories', name: 'Stories' },
        { id: 'Intelligence', name: 'Intelligence' },
        { id: 'Solutions', name: 'Solutions' },
        { id: 'SecDevOps', name: 'SecDevOps' },
        { id: 'Products', name: 'Products' },
        { id: 'Delivery - Deploys', name: 'Delivery — Deploys' },
        { id: 'Delivery - Designs', name: 'Delivery — Designs' },
        { id: 'DCO Operations', name: 'DCO Operations' },
        { id: 'DBP Platform', name: 'DBP Platform' },
        { id: 'DBP Delivery', name: 'DBP Delivery' },
      ],
    },
    {
      id: 'location',
      title: 'Location/Studio',
      options: [
        { id: 'Dubai', name: 'Dubai' },
        { id: 'Nairobi', name: 'Nairobi' },
        { id: 'Riyadh', name: 'Riyadh' },
        { id: 'Remote', name: 'Remote' },
      ],
    },
  ], []);

  const urlBasedFilters: Record<string, string[]> = useMemo(() => ({
    department: departmentFilters,
    location: locationFilters,
  }), [departmentFilters, locationFilters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Mobile filter toggle */}
      <div className="xl:hidden sticky top-16 z-20 bg-gray-50 py-2 shadow-sm">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 w-full justify-center"
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

      {/* Main content - Projects List */}
      <div className="xl:w-3/4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Projects ({filteredProjects.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('project', project.id);
                setSearchParams(newParams, { replace: true });
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded capitalize ${getStatusColor(
                    project.status
                  )}`}
                >
                  {project.status.replace('-', ' ')}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{project.workItems.length} work items</p>
                <p>
                  {project.department.join(', ')} • {project.location.join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
