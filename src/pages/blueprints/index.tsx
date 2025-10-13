import React, { useMemo, useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MarketplaceCard } from '../../components/Cards';
import { ResponsiveCardGrid } from '../../components/Cards/ResponsiveCardGrid';
import { FileText, ArrowLeft, HomeIcon, ChevronRightIcon, FolderOpen } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { SearchBar } from '../../components/SearchBar';

interface Blueprint {
  id: string;
  title: string;
  description: string;
  lastUpdated?: string;
  author?: string;
  url?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  blueprints: Blueprint[];
  color: string;
}

// Mock data - replace with actual data from your backend
const projects: Project[] = [
  {
    id: 'dtma',
    name: 'DTMA - Digital Transformation Management Academy',
    description: 'Comprehensive training and development programs for digital transformation leaders and practitioners.',
    color: 'blue',
    blueprints: [
      {
        id: 'dtma-1',
        title: 'DTMA Learning Path Architecture',
        description: 'Complete blueprint for structuring the learning journey and curriculum design.',
        lastUpdated: '2025-10-10',
        author: 'Learning Design Team'
      },
      {
        id: 'dtma-2',
        title: 'Assessment Framework Blueprint',
        description: 'Comprehensive framework for evaluating learner progress and competency.',
        lastUpdated: '2025-10-08',
        author: 'Assessment Team'
      },
      {
        id: 'dtma-3',
        title: 'Platform Integration Design',
        description: 'Technical blueprint for integrating DTMA with existing DQ platforms.',
        lastUpdated: '2025-10-05',
        author: 'Technical Architecture Team'
      }
    ]
  },
  {
    id: 'dt20',
    name: 'DT 2.0 - Digital Transformation Platform',
    description: 'Next-generation digital transformation platform for enterprise-wide initiatives.',
    color: 'indigo',
    blueprints: [
      {
        id: 'dt20-1',
        title: 'System Architecture Overview',
        description: 'High-level architecture and technical design for the DT 2.0 platform.',
        lastUpdated: '2025-10-12',
        author: 'Solution Architects'
      },
      {
        id: 'dt20-2',
        title: 'User Experience Design',
        description: 'Comprehensive UX/UI design blueprint with wireframes and prototypes.',
        lastUpdated: '2025-10-11',
        author: 'UX Design Team'
      },
      {
        id: 'dt20-3',
        title: 'Integration Strategy',
        description: 'Blueprint for integrating with third-party systems and APIs.',
        lastUpdated: '2025-10-09',
        author: 'Integration Team'
      },
      {
        id: 'dt20-4',
        title: 'Security & Compliance Framework',
        description: 'Security architecture and compliance requirements documentation.',
        lastUpdated: '2025-10-07',
        author: 'Security Team'
      }
    ]
  },
  {
    id: 'customer-portal',
    name: 'Customer Portal Enhancement',
    description: 'Enhanced customer-facing portal with improved functionality and user experience.',
    color: 'cyan',
    blueprints: [
      {
        id: 'portal-1',
        title: 'Portal Redesign Blueprint',
        description: 'Complete redesign strategy with modern UI/UX principles.',
        lastUpdated: '2025-10-06',
        author: 'Portal Team'
      },
      {
        id: 'portal-2',
        title: 'Self-Service Features',
        description: 'Blueprint for implementing customer self-service capabilities.',
        lastUpdated: '2025-10-04',
        author: 'Product Team'
      }
    ]
  },
  {
    id: 'data-analytics',
    name: 'Data Analytics Platform',
    description: 'Advanced analytics and business intelligence platform for data-driven decision making.',
    color: 'purple',
    blueprints: [
      {
        id: 'analytics-1',
        title: 'Data Pipeline Architecture',
        description: 'Blueprint for ETL processes and data warehouse design.',
        lastUpdated: '2025-10-03',
        author: 'Data Engineering Team'
      },
      {
        id: 'analytics-2',
        title: 'Dashboard & Visualization Design',
        description: 'Design patterns for analytics dashboards and data visualization.',
        lastUpdated: '2025-10-01',
        author: 'BI Team'
      },
      {
        id: 'analytics-3',
        title: 'AI/ML Integration Blueprint',
        description: 'Framework for integrating machine learning models and AI capabilities.',
        lastUpdated: '2025-09-28',
        author: 'AI/ML Team'
      }
    ]
  }
];

export default function BlueprintsPage() {
  const { projectId } = useParams<{ projectId?: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects and blueprints based on search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;

    const query = searchQuery.toLowerCase();
    return projects
      .map(project => ({
        ...project,
        blueprints: project.blueprints.filter(
          blueprint =>
            blueprint.title.toLowerCase().includes(query) ||
            blueprint.description.toLowerCase().includes(query) ||
            project.name.toLowerCase().includes(query)
        )
      }))
      .filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.blueprints.length > 0
      );
  }, [searchQuery]);

  const currentProject = projectId
    ? projects.find(p => p.id === projectId)
    : null;

  const showProjects = !projectId;
  const showBlueprints = !!projectId && !!currentProject;

  // Simple no-op handler
  const noop = () => undefined;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="container mx-auto px-0">
            {/* Breadcrumb Navigation */}
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                    <HomeIcon size={16} className="mr-1" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    {showBlueprints ? (
                      <Link to="/blueprints" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                        Blueprints
                      </Link>
                    ) : (
                      <span className="ml-1 text-gray-500 md:ml-2">Blueprints</span>
                    )}
                  </div>
                </li>
                {showBlueprints && currentProject && (
                  <li aria-current="page">
                    <div className="flex items-center">
                      <ChevronRightIcon size={16} className="text-gray-400" />
                      <span className="ml-1 text-gray-500 md:ml-2">{currentProject.name}</span>
                    </div>
                  </li>
                )}
              </ol>
            </nav>

            {/* Page Header */}
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#030F35' }}>DQ Blueprints</h1>
            <p className="text-gray-600 mb-6">
              Welcome to the DQ Blueprints page. Explore a variety of blueprints for our digital transformation projects.
              Click on a project name below to view the associated blueprints. Use the search bar to find specific blueprints or browse by project.
            </p>

            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
          </div>

          {/* Back Button */}
          {showBlueprints && (
            <button
              className="mb-4 inline-flex items-center gap-2 transition-colors hover:opacity-80"
              style={{ color: '#1A2E6E' }}
              onClick={() => navigate('/blueprints')}
            >
              <ArrowLeft size={18} /> Back to Projects
            </button>
          )}

          {/* Projects Grid */}
          {showProjects && (
            <ResponsiveCardGrid>
              {filteredProjects.map(project => {
                const item = {
                  id: project.id,
                  title: project.name,
                  description: project.description,
                  provider: {
                    name: `${project.blueprints.length} Blueprint${project.blueprints.length !== 1 ? 's' : ''}`,
                    logoUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
                  },
                  tags: [project.color.toUpperCase()]
                };
                return (
                  <div key={project.id} className="blueprint-card">
                    <style>{`.blueprint-card button:empty{display:none}`}</style>
                    <MarketplaceCard
                      item={item}
                      config={{ primaryCTA: '', secondaryCTA: 'View Blueprints' }}
                      onQuickView={noop}
                      onViewDetails={() => navigate(`/blueprints/${project.id}`)}
                      onToggleBookmark={noop}
                      onAddToComparison={noop}
                      onPrimaryAction={noop}
                    />
                  </div>
                );
              })}
            </ResponsiveCardGrid>
          )}

          {/* No Results Message */}
          {showProjects && filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No projects found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}

          {/* Blueprints List */}
          {showBlueprints && currentProject && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentProject.name}</h2>
                <p className="text-gray-600">{currentProject.description}</p>
              </div>

              {currentProject.blueprints.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {currentProject.blueprints.map(blueprint => (
                    <div
                      key={blueprint.id}
                      className="relative border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, rgba(251, 85, 53, 0.05) 0%, rgba(26, 46, 110, 0.05) 50%, rgba(3, 15, 53, 0.08) 100%)'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="p-2 rounded-lg" style={{
                            background: 'linear-gradient(135deg, #FB5535 0%, #1A2E6E 50%, #030F35 100%)'
                          }}>
                            <FileText size={24} className="text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold mb-1" style={{ color: '#030F35' }}>
                            {blueprint.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {blueprint.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            {blueprint.author && (
                              <span className="flex items-center gap-1">
                                <span className="font-medium" style={{ color: '#1A2E6E' }}>Author:</span> {blueprint.author}
                              </span>
                            )}
                            {blueprint.lastUpdated && (
                              <span className="flex items-center gap-1">
                                <span className="font-medium" style={{ color: '#1A2E6E' }}>Updated:</span> {new Date(blueprint.lastUpdated).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          {blueprint.url && (
                            <div className="mt-3">
                              <a
                                href={blueprint.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-medium inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-white transition-all hover:opacity-90"
                                style={{
                                  background: 'linear-gradient(135deg, #FB5535 0%, #1A2E6E 50%, #030F35 100%)'
                                }}
                              >
                                View Blueprint
                                <ArrowLeft size={14} className="rotate-180" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                  <p>No blueprints available for this project yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
