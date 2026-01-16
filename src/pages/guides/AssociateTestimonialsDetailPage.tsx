import React from "react"
import { Link } from "react-router-dom"
import { HomeIcon, ChevronRightIcon } from "lucide-react"
import { Header } from "../../components/Header"
import { Footer } from "../../components/Footer"

// Associate testimonials data
const associateTestimonialsData = [
  {
    id: "jerry-ashie",
    name: "Jerry Ashie",
    organization: "Accounts Manager & Scrum master",
    quote: "Digital Qatalyst's values and mission have encouraged me to continuously learn, adapt, and take ownership of my work. They have pushed me to embrace challenges with curiosity rather than hesitation and to see feedback as a tool for growth. The focus on collaboration and innovation has helped me strengthen my problem-solving and communication skills. I've become more resilient in navigating change and more confident in stepping outside my comfort zone. Overall, these values have supported my growth both professionally and personally by fostering a strong growth mindset."
  },
  {
    id: "vishnu-chandran",
    name: "Vishnu Chandran",
    organization: "CoE Analyst",
    quote: "DigitalQatalyst's values has helped me focus on creating real impact, not just completing tasks. It has encouraged me to take ownership and think clearly about outcomes. Values like accountability, collaboration, and continuous learning have supported my growth. This has helped me become more confident and responsible in my role and as an individual."
  },
  {
    id: "sharon-adhiambo",
    name: "Sharon Adhiambo",
    organization: "HR Analyst",
    quote: "A value that has significantly influenced my growth is Collaboration. It has taught me the importance of leaning on others' strengths and openly sharing progress, challenges, and insights. By engaging more with my team, I've gained new perspectives that improved the quality of my work. For example, I began seeking timely feedback and involving the right people earlier in my tasks. This has made my work more efficient, aligned, and impactful."
  },
  {
    id: "fadil-alli",
    name: "Fadil Alli",
    organization: "CoE Analyst",
    quote: "One key value in DQ that has influenced my growth is ownership. It's still something I'm working on every day, but I've already noticed the positive impact it has on how I approach my tasks. For example, as a Scrum Master, I've been focusing on taking more responsibility for the challenges in the Product Factory. While it's a work in progress, I've seen improved collaboration and clearer accountability within the team when there's a strong sense of ownership, which has led to more streamlined processes."
  }
]

const AssociateTestimonialsDetailPage: React.FC = () => {
  const disclaimer = '(not approved for external publication)'

  // Keep testimonials-specific hero image but style like guidelines hero
  const heroImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <Link to="/marketplace/guides?tab=testimonials" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                  Testimonials
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">Associate Testimonials</span>
              </div>
            </li>
          </ol>
        </nav>

      </div>

      {/* Hero full-bleed like guidelines */}
      <div className="w-full bg-gray-900">
        <div className="relative w-full h-80 md:h-[420px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-[#030E31] bg-opacity-75" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-6 lg:px-8 text-white max-w-full">
            <span
              className="inline-flex self-start px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-sm font-medium mb-4"
              style={{ width: 'fit-content' }}
            >
              Testimonials
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Associate Testimonials
            </h1>
            <p className="text-white/85 max-w-2xl">
              Stories from DQ associates showcasing how Digital Qatalyst's values and culture have supported their professional and personal growth.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Featured Associates Section */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How DQ values shape growth</h2>
            <p className="text-gray-600">
              Associates share how Digital Qatalyst's values—collaboration, ownership, accountability, and continuous learning—have influenced their professional development and impact.
            </p>
          </div>

          {/* Associate Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {associateTestimonialsData.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600">
                      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor" />
                      <path d="M12 14C7.58172 14 4 16.6863 4 20V22H20V20C20 16.6863 16.4183 14 12 14Z" fill="currentColor" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-900 text-center">{testimonial.name}</p>
                  <p className="text-xs text-gray-500 text-center mt-1">{testimonial.organization}</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "{testimonial.quote}"
                  <span className="block text-xs text-gray-500 italic mt-2">{disclaimer}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>
  )
}

export default AssociateTestimonialsDetailPage
