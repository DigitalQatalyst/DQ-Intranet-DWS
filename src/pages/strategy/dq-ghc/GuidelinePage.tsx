import { Link } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon } from 'lucide-react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { HeroSection } from './HeroSection'
import { SideNav } from './SideNav'
import { GuidelineSection } from './GuidelineSection'

function GuidelinePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <nav className="flex" aria-label="Breadcrumb">
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
                  <Link
                    to="/marketplace/guides?tab=strategy"
                    className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                  >
                    Strategy
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">DQ GHC</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <HeroSection />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Introduction */}
              <GuidelineSection id="introduction" title="Introduction">
                <p className="mb-6">
                  Starting at DQ or even navigating your role as an existing Qatalyst can feel overwhelming. But here's the secret:
                  everything we do is guided by a system. That system is the <strong>Golden Honeycomb of Competencies (GHC)</strong> – our
                  master framework, blueprint, and operating system rolled into one.
                </p>
                <p className="mb-6">
                  The GHC defines how we think, how we work, how we create value, and how we grow. It brings together the skills,
                  behaviours, and systems that make a Qatalyst effective, ensuring every action, decision, and collaboration is purposeful
                  and aligned with DQ's mission. Think of it as your map, compass, and toolkit helping you:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                  <li>Work together seamlessly with your team</li>
                  <li>Make decisions that actually move the needle</li>
                  <li>Solve problems creatively and confidently</li>
                  <li>Deliver real, measurable value to our clients</li>
                </ul>
                <p className="mb-6">
                  In short, the GHC is your guide to thriving at DQ and understanding why every choice matters.
                </p>
              </GuidelineSection>

              {/* Why the GHC Exists */}
              <GuidelineSection id="why-ghc-exists" title="Why the GHC Exists">
                <p className="mb-6">
                  DQ tackles complex digital challenges across industries. Without alignment, things can quickly get messy. The GHC exists
                  to make everything coherent, purposeful, and impactful:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                  <li>Everyone knows why we do what we do</li>
                  <li>Teams can collaborate effortlessly</li>
                  <li>Work moves forward with clarity and intention</li>
                  <li>Learning and improvement are built into every task</li>
                </ul>
                <p className="mb-6">
                  Put simply, the GHC is why DQ feels cohesive, agile, and unstoppable, even in fast-changing environments.
                </p>
              </GuidelineSection>

              {/* The 7 Competencies of the GHC */}
              <GuidelineSection id="seven-competencies" title="The 7 Competencies of the GHC">
                <p className="mb-6">
                  At the heart of the GHC are seven interlinked competencies – each answering a foundational question about how a
                  high-performing, purpose-driven digital organisation operates. Together, they form DQ's DNA.
                </p>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Vision (Purpose) — Why We Exist</h3>
                  <p className="mb-4">
                    <strong>To perfect life's transactions.</strong> This competency anchors everything in why we do what we do, guiding
                    priorities, aligning playbooks and platforms, and keeping us focused on building trust, clarity, and momentum, not just
                    technology.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">2. House of Values (Culture) — How We Behave</h3>
                  <p className="mb-4">
                    Culture isn't accidental. The House of Values (HoV) defines how we act, especially when stakes are high:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
                    <li>
                      <strong>Self-Development</strong> — growth is a daily responsibility
                    </li>
                    <li>
                      <strong>Lean Working</strong> — clarity, focus, and momentum over noise
                    </li>
                    <li>
                      <strong>Value Co-Creation</strong> — collaboration scales intelligence
                    </li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Persona (Identity) — Who We Are</h3>
                  <p className="mb-4">
                    Skills evolve, fit endures. The DQ Persona describes the traits of high-impact Qatalysts:
                  </p>
                  <p className="mb-4 font-medium text-gray-800">
                    Purpose-driven • Perceptive • Proactive • Persevering • Precise
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Agile TMS (Task Management System) — How We Work</h3>
                  <p className="mb-4">Strategy only matters if it turns into motion. Agile TMS helps us:</p>
                  <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
                    <li>Break work into clear, actionable tasks</li>
                    <li>Maintain rhythm through sprints, check-ins, and reviews</li>
                    <li>Ensure every action drives real value</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Agile SoS (Governance) — How We Govern</h3>
                  <p className="mb-4">
                    Governance isn't a brake, it's a steering wheel. Agile SoS ensures alignment, quality, value, and discipline, letting
                    us move fast without losing direction.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">6. Agile Flows (Value Streams) — How We Orchestrate</h3>
                  <p className="mb-4">
                    Work flows end-to-end, not in silos. Agile Flows structure delivery across the full value chain, connecting market
                    insight to client impact, reducing blockers, and giving clarity on ownership and risk.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">7. Agile 6xD (Products) — What We Offer</h3>
                  <p className="mb-4">
                    This framework helps DQ design, deliver, and scale transformation. Through six digital perspectives, we help
                    organisations understand why they must change, what to build, how to execute, who delivers, and when value is realised.
                  </p>
                </div>
              </GuidelineSection>

              {/* How the GHC Shapes You */}
              <GuidelineSection id="how-ghc-shapes-you" title="How the GHC Shapes You">
                <p className="mb-8 text-lg text-gray-700">
                  The GHC isn't just theory – it shapes your daily work, decisions, and impact. Use it to:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Grow Yourself Every Day</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Embrace feedback, learn constantly, and turn challenges into growth.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Work Smart and Lean</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Focus on what matters, take initiative, and sweat the details that drive real value.
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Create Value with Others</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Collaborate openly, design with empathy, and build trust through clarity and consistency.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                  <p className="text-lg font-medium text-gray-800">
                    Think of these as practical superpowers you can start using from day one.
                  </p>
                </div>
              </GuidelineSection>

              {/* How Work Flows at DQ */}
              <GuidelineSection id="how-work-flows" title="How Work Flows at DQ">
                <p className="mb-6">
                  At DQ, work doesn't happen in silos. Everything moves through connected value streams – from ideas to delivery to lasting
                  impact. Here's what that means for you:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                  <li>
                    <strong>Agile task management</strong> – know exactly what to do, who owns it, and why it matters.
                  </li>
                  <li>
                    <strong>Guided governance</strong> – direction and quality without slowing down.
                  </li>
                  <li>
                    <strong>End-to-end collaboration</strong> – your work links directly to client outcomes.
                  </li>
                </ul>
                <p className="mb-6">
                  By understanding these flows, you'll see how your contribution fits into the bigger picture, making your role meaningful
                  every day.
                </p>
              </GuidelineSection>

              {/* Your Role as a Qatalyst */}
              <GuidelineSection id="your-role-as-qatalyst" title="Your Role as a Qatalyst">
                <p className="mb-6">
                  You don't need to master everything at once. Keep the Honeycomb in mind:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                  <li>Ask: "Does this task create real value?"</li>
                  <li>Look for opportunities to collaborate and support others.</li>
                  <li>Apply GHC principles to make confident decisions.</li>
                  <li>Notice how your work connects to larger projects and outcomes.</li>
                </ul>
                <p className="mb-6">
                  The GHC is a Honeycomb for a reason—every part is connected, and every Qatalyst strengthens the whole. Live it, and you'll
                  become more impactful, confident, and strategic every day.
                </p>
                <div
                  className="mb-6 p-6 rounded-lg border-l-4"
                  style={{ backgroundColor: 'var(--guidelines-primary-surface)', borderColor: 'var(--guidelines-primary)' }}
                >
                  <p className="text-lg font-semibold text-gray-800 mb-2">Pro Tip</p>
                  <p className="text-gray-700">
                    Keep this Honeycomb in mind as you start your journey. Whether it's a sprint, a client call, or a problem-solving
                    session, your choices, actions, and mindset shape the DQ mission — transaction by transaction, life by life,
                    organisation by organisation.
                  </p>
                </div>
              </GuidelineSection>
            </div>

            <aside className="lg:col-span-1">
              <SideNav />
            </aside>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GuidelinePage

