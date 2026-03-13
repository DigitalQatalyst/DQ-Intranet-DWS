import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon, CheckCircle, Clock, MapPin, Users, Building } from 'lucide-react'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { useAuth } from '../../components/Header/context/AuthContext'
import { supabaseClient } from '../../lib/supabaseClient'

interface ServiceDetail {
  id: string
  title: string
  description: string
  category: string
  service_type: string
  delivery_mode: string
  provider: string
  location?: string
  response_time?: string
  highlights?: string[]
  request_process?: any
  faqs?: any[]
  contact_info?: any
  sla_details?: any
}

export default function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [service, setService] = useState<ServiceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'details' | 'request' | 'faq' | 'contact'>('details')

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return

      try {
        const { data, error } = await supabaseClient
          .from('services')
          .select('*')
          .eq('id', serviceId)
          .single()

        if (error) throw error
        setService(data)
      } catch (error) {
        console.error('Error fetching service:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [serviceId])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
            <p className="text-gray-600 mb-4">The service you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/marketplace/services-center')}
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Services Center
            </button>
          </div>
        </div>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  const getCategoryBadge = () => {
    const categoryMap: Record<string, string> = {
      technology: 'TECHNOLOGY SERVICE',
      business: 'BUSINESS SERVICE',
      digital_worker: 'DIGITAL WORKER SERVICE',
      prompt_library: 'PROMPT LIBRARY',
      ai_tools: 'AI TOOLS'
    }
    return categoryMap[service.category] || 'SERVICE'
  }

  const getServiceTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      query: 'Query',
      support: 'Support',
      requisition: 'Requisition',
      'self-service': 'Self-Service'
    }
    return typeMap[type] || type
  }

  const getDeliveryModeLabel = (mode: string) => {
    const modeMap: Record<string, string> = {
      online: 'Online',
      inperson: 'In Person',
      hybrid: 'Hybrid'
    }
    return modeMap[mode] || mode
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />

      {/* Hero Section */}
      <div 
        className="relative w-full min-h-[200px] bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 text-white"
        style={{
          background: 'linear-gradient(135deg, #4A1D6E 0%, #1A2B5E 100%)'
        }}
      >
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Breadcrumb */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2">
              <li className="inline-flex items-center">
                <Link to="/" className="text-white/80 hover:text-white inline-flex items-center text-sm">
                  <HomeIcon size={16} className="mr-1" />
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-white/60" />
                  <Link 
                    to="/marketplace/services-center" 
                    className="ml-2 text-white/80 hover:text-white text-sm"
                  >
                    Services Center
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-white/60" />
                  <span className="ml-2 text-white/90 text-sm">{service.title}</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Service Badge */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-white/20 rounded-full">
              {getCategoryBadge()}
            </span>
          </div>

          {/* Service Title */}
          <h1 className="text-4xl font-bold mb-4">{service.title}</h1>

          {/* Service Description */}
          <p className="text-lg text-white/90 max-w-3xl mb-6">
            {service.description}
          </p>

          {/* Service Metadata Tags */}
          <div className="flex flex-wrap gap-4 text-sm">
            {service.service_type && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <span className="text-white/70">Type:</span>
                <span className="font-medium">{getServiceTypeLabel(service.service_type)}</span>
              </div>
            )}
            {service.delivery_mode && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <span className="text-white/70">Mode:</span>
                <span className="font-medium">{getDeliveryModeLabel(service.delivery_mode)}</span>
              </div>
            )}
            {service.provider && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <Building size={16} />
                <span className="font-medium">{service.provider}</span>
              </div>
            )}
            {service.location && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <MapPin size={16} />
                <span className="font-medium">{service.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Tab Navigation */}
              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'details'
                          ? 'border-pink-600 text-pink-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Service Details
                    </button>
                    <button
                      onClick={() => setActiveTab('request')}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'request'
                          ? 'border-pink-600 text-pink-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      How to Request
                    </button>
                    <button
                      onClick={() => setActiveTab('faq')}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'faq'
                          ? 'border-pink-600 text-pink-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      FAQ
                    </button>
                    <button
                      onClick={() => setActiveTab('contact')}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'contact'
                          ? 'border-pink-600 text-pink-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Contact & SLA
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                  {activeTab === 'details' && (
                    <div>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {service.description}
                      </p>

                      {service.highlights && service.highlights.length > 0 && (
                        <div className="mt-8">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Highlights</h3>
                          <div className="space-y-3">
                            {service.highlights.map((highlight, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                                <span className="text-gray-700">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'request' && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Process</h3>
                      <p className="text-gray-700 mb-6">
                        Follow these steps to request this service:
                      </p>
                      {service.request_process?.steps ? (
                        <ol className="list-decimal list-inside space-y-3 text-gray-700">
                          {service.request_process.steps.map((step: string, index: number) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      ) : (
                        <p className="text-gray-600">
                          Click the "Request Service" button to submit your request. Our team will get back to you shortly.
                        </p>
                      )}
                    </div>
                  )}

                  {activeTab === 'faq' && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
                      {service.faqs && service.faqs.length > 0 ? (
                        <div className="space-y-6">
                          {service.faqs.map((faq: any, index: number) => (
                            <div key={index}>
                              <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                              <p className="text-gray-700">{faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">
                          No FAQs available for this service yet. Please contact the service provider for more information.
                        </p>
                      )}
                    </div>
                  )}

                  {activeTab === 'contact' && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Department</p>
                          <p className="text-gray-900">{service.provider}</p>
                        </div>
                        {service.contact_info?.email && (
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                            <p className="text-gray-900">{service.contact_info.email}</p>
                          </div>
                        )}
                        {service.response_time && (
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Response Time</p>
                            <p className="text-gray-900">{service.response_time}</p>
                          </div>
                        )}
                      </div>

                      {service.sla_details && (
                        <div className="mt-8">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Service Level Agreement</h4>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            {service.sla_details.responseTime && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Response Time:</span>
                                <span className="font-medium text-gray-900">{service.sla_details.responseTime}</span>
                              </div>
                            )}
                            {service.sla_details.resolutionTime && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Resolution Time:</span>
                                <span className="font-medium text-gray-900">{service.sla_details.resolutionTime}</span>
                              </div>
                            )}
                            {service.sla_details.availability && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Availability:</span>
                                <span className="font-medium text-gray-900">{service.sla_details.availability}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    {service.service_type && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Service Type</p>
                        <p className="text-gray-900 font-medium">{getServiceTypeLabel(service.service_type)}</p>
                      </div>
                    )}
                    {service.delivery_mode && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Delivery Mode</p>
                        <p className="text-gray-900 font-medium">{getDeliveryModeLabel(service.delivery_mode)}</p>
                      </div>
                    )}
                    {service.response_time && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Response Time</p>
                        <p className="text-gray-900 font-medium">{service.response_time}</p>
                      </div>
                    )}
                    {service.provider && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Department</p>
                        <p className="text-gray-900 font-medium">{service.provider}</p>
                      </div>
                    )}
                    {service.location && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Location</p>
                        <p className="text-gray-900 font-medium">{service.location}</p>
                      </div>
                    )}
                  </div>

                  <button
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-3"
                    onClick={() => {
                      // TODO: Implement request service functionality
                      alert('Request service functionality to be implemented')
                    }}
                  >
                    Request Service →
                  </button>

                  <button
                    className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    onClick={() => {
                      // TODO: Implement save for later functionality
                      alert('Save for later functionality to be implemented')
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Save for Later
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Services Section */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Related Services</h2>
              <Link 
                to="/marketplace/services-center" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Browse all services →
              </Link>
            </div>
            <div className="text-gray-600">
              Related services will be displayed here based on category and department.
            </div>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}
