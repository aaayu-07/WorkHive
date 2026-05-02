import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Play, CheckCircle2, Layout, Zap,
  BarChart3, Users, Clock, ShieldCheck, Sun, Moon,
  FolderKanban, MessageSquare, Paperclip, Shield, TimerReset, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] overflow-hidden font-sans selection:bg-[var(--color-primary-base)]/30">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[420px] bg-[linear-gradient(180deg,rgba(47,126,121,0.16),transparent)] dark:bg-[linear-gradient(180deg,rgba(47,126,121,0.10),transparent)]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-base)] flex items-center justify-center text-white font-bold shadow-lg shadow-green-500/20">
            W
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">WorkHive</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-text-secondary)]">
          <a href="#product" className="hover:text-[var(--color-text-primary)] transition-colors">Product</a>
          <a href="#pricing" className="hover:text-[var(--color-text-primary)] transition-colors">Pricing</a>
          <a href="#about" className="hover:text-[var(--color-text-primary)] transition-colors">About</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {user ? (
            <Link to="/" className="text-sm font-bold bg-[var(--color-surface)] border border-[var(--color-border)] px-5 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block text-sm font-bold hover:text-[var(--color-primary-base)] transition-colors">Log In</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-10 pb-16 max-w-7xl mx-auto min-h-[calc(100vh-88px)] flex flex-col justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center"
        >
          <div className="flex items-center justify-center mb-7">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm px-4 py-1.5 rounded-full flex items-center gap-3 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Built for busy bees
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-[var(--color-text-primary)] leading-[1.05]">
            Run every project from one <span className="text-[var(--color-primary-base)]">clear command center.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 font-medium">
            Project roles, task boards, due dates, comments, attachments, and live dashboard insights in one focused workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-3.5 bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-light)] text-white rounded-full font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-3.5 bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-gray-50 dark:hover:bg-[#1A2E25] rounded-full font-bold transition-all flex items-center justify-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              Watch Workflow
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-9 text-sm text-[var(--color-text-secondary)] font-medium">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-[var(--color-primary-base)]" /> Role-protected workspace</div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-2"><TimerReset className="w-4 h-4 text-amber-500" /> Overdue task tracking</div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500" /> Team performance charts</div>
          </div>
        </motion.div>

        {/* Product Capability Cockpit */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-14 w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[0.75fr_1.35fr_0.9fr] gap-4 text-left">
            <div className="space-y-4">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-[var(--color-primary-base)]" />
                    <span className="text-sm font-bold">Projects</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)]">4 active</span>
                </div>
                <div className="space-y-3">
                  {[
                    ['Website Launch', '8 members', '72%', 'bg-[var(--color-primary-base)]'],
                    ['Hiring Sprint', '3 members', '41%', 'bg-blue-500'],
                    ['Client Onboarding', '5 members', '88%', 'bg-amber-500'],
                  ].map(([name, meta, progress, color]) => (
                    <div key={name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-semibold">{name}</span>
                        <span className="text-[var(--color-text-secondary)]">{meta}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                        <div className={`h-full ${color}`} style={{ width: progress }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
                  <div className="text-3xl font-black">24</div>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-1">Open tasks</div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="text-3xl font-black text-red-500">3</div>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-1">Overdue</div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <div className="text-sm font-bold">Website Launch Board</div>
                  <div className="text-xs text-[var(--color-text-secondary)]">Drag status, assign owners, keep delivery moving</div>
                </div>
                <div className="flex -space-x-2">
                  {['A', 'M', 'R', 'S'].map(initial => (
                    <div key={initial} className="w-8 h-8 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-primary-base)]/15 text-[var(--color-primary-base)] flex items-center justify-center text-xs font-bold">
                      {initial}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  ['To Do', 'API deployment checklist', 'High', 'text-red-500 bg-red-500/10 border-red-500/20'],
                  ['In Progress', 'Admin role permissions', 'Medium', 'text-amber-600 bg-amber-500/10 border-amber-500/20'],
                  ['Done', 'Dashboard analytics cards', 'Low', 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'],
                ].map(([column, task, priority, badge]) => (
                  <div key={column} className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 min-h-[190px]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold">{column}</span>
                      <span className="text-[10px] text-[var(--color-text-secondary)]">1</span>
                    </div>
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3">
                      <div className="text-sm font-semibold leading-snug">{task}</div>
                      <div className="flex items-center justify-between mt-4">
                        <span className={`text-[10px] px-2 py-1 rounded-md border ${badge}`}>{priority}</span>
                        {column === 'Done' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-primary-base)]" />
                  <span className="text-sm font-bold">Role Controls</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Project creator</span>
                    <span className="px-2 py-1 rounded-md bg-[var(--color-primary-base)]/10 text-[var(--color-primary-base)] font-bold">Admin</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Assigned teammate</span>
                    <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-500 font-bold">Status only</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Outside project</span>
                    <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-500 font-bold">Blocked</span>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold">Collaboration</span>
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                </div>
                <div className="space-y-3">
                  <div className="text-xs bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3">
                    "Can you review the Railway env setup before launch?"
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                    <Paperclip className="w-4 h-4" />
                    deployment-notes.pdf attached
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
                <div className="flex items-end justify-between gap-2 h-24">
                  {[42, 68, 54, 82, 63, 95].map((height, index) => (
                    <div key={index} className="flex-1 bg-blue-500/10 rounded-md overflow-hidden">
                      <div className="mt-auto bg-blue-500 rounded-md" style={{ height: `${height}%` }} />
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-[var(--color-text-secondary)]">Tasks completed per user</div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center text-xs text-[var(--color-text-secondary)]">
            Projects, tasks, members, permissions, comments, files, and reporting visible from the first login.
          </div>
        </motion.div>
      </main>

      {/* About / Optimization Section (Inspired by light mode mockup) */}
      <section id="about" className="relative z-10 py-24 px-6 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
              Managerial optimization <br/> for your company
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)]">
              Choose efficiency or flexibility for your organisation. Reconstruction of your team will lead to improved productivity, collaboration, and higher business results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 bg-[var(--color-primary-base)]/10 rounded-[2rem] p-8 flex flex-col justify-end min-h-[300px]">
              <h3 className="text-xl font-bold text-[var(--color-text-main)]">Our mission is to make your team efficient and flexible to achieve great results.</h3>
            </div>
            <div className="md:col-span-1 bg-[var(--color-bg)] rounded-[2rem] p-8 flex flex-col justify-center items-center text-center">
              <h2 className="text-5xl font-black mb-2">350%</h2>
              <p className="text-sm text-[var(--color-text-muted)]">Average annual growth rate among our clients</p>
            </div>
            <div className="md:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-end">
               <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary-base)]/10 to-transparent z-0"/>
               <div className="relative z-10">
                  <h2 className="text-4xl font-black mb-2">95%</h2>
                  <p className="text-sm text-[var(--color-text-muted)]">ROAS has increased prior to funding</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="product" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to scale</h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">Powerful features wrapped in a beautiful, intuitive interface. Say goodbye to scattered tools.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Layout, title: "Kanban Boards", desc: "Visualize your workflow with fluid drag-and-drop boards. Keep track of what needs to be done." },
            { icon: Zap, title: "Real-time Speed", desc: "Built on modern web technologies ensuring snappy transitions and instant feedback." },
            { icon: BarChart3, title: "Smart Analytics", desc: "Get a high-level overview of your team's progress with beautiful, automatic charts." },
            { icon: Users, title: "Team Collaboration", desc: "Assign tasks, leave comments, and keep everyone on the same page." },
            { icon: Clock, title: "Time Tracking", desc: "Monitor how long tasks take and optimize your team's delivery timeline." },
            { icon: ShieldCheck, title: "Admin Controls", desc: "Granular permissions ensure the right people have access to the right data." }
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-[var(--color-surface)] dark:bg-[#111C18] border border-[var(--color-border)] dark:border-[#1A2E25] rounded-2xl hover:border-[var(--color-primary-base)]/50 transition-colors group">
              <div className="w-12 h-12 bg-[var(--color-primary-base)]/10 rounded-xl flex items-center justify-center mb-4 text-[var(--color-primary-base)] group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-24 px-6 bg-gray-50 dark:bg-gray-900/30 border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-[var(--color-text-secondary)]">Choose the plan that best fits your team's needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {/* Free */}
            <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl">
              <h3 className="text-xl font-bold mb-2">Free Plan</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black">$0</span>
                <span className="text-[var(--color-text-secondary)]">/month</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm">
                <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-[var(--color-primary-base)]"/> Up to 3 projects</li>
                <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-[var(--color-primary-base)]"/> Basic task management</li>
                <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-[var(--color-primary-base)]"/> Limited analytics</li>
              </ul>
              <Link to="/register" className="block text-center w-full py-3 rounded-xl border border-[var(--color-border)] font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Start Free</Link>
            </div>

            {/* Pro */}
            <div className="p-8 bg-[var(--color-surface)] border-2 border-[var(--color-primary-base)] rounded-3xl relative shadow-xl transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-primary-base)] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
              <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black">$12</span>
                <span className="text-[var(--color-text-secondary)]">/month</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm">
                <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-[var(--color-primary-base)]"/> Unlimited projects</li>
                <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-[var(--color-primary-base)]"/> Advanced analytics</li>
                <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-[var(--color-primary-base)]"/> Priority support</li>
                <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-[var(--color-primary-base)]"/> Team collaboration tools</li>
              </ul>
              <Link to="/register" className="block text-center w-full py-3 rounded-xl bg-[var(--color-primary-base)] text-white font-bold hover:bg-[var(--color-primary-light)] transition-colors">Upgrade to Pro</Link>
            </div>

            {/* Team */}
            <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl">
              <h3 className="text-xl font-bold mb-2">Team Plan</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black">$24</span>
                <span className="text-[var(--color-text-secondary)]">/month</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm">
                <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-[var(--color-primary-base)]"/> Everything in Pro</li>
                <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-[var(--color-primary-base)]"/> Team roles & permissions</li>
                <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-[var(--color-primary-base)]"/> Activity logs</li>
                <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-[var(--color-primary-base)]"/> Admin controls</li>
              </ul>
              <Link to="/contact" className="block text-center w-full py-3 rounded-xl border border-[var(--color-border)] font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-32 px-6 text-center">
        <div className="absolute inset-0 bg-[var(--color-primary-base)]/5 blur-[100px] -z-10" />
        <h2 className="text-4xl md:text-5xl font-black mb-8">Start managing your work smarter today</h2>
        <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-text-primary)] text-[var(--color-bg)] rounded-full font-bold text-lg hover:scale-105 transition-transform">
          Get Started For Free
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-text-secondary)]">
        <div className="flex items-center justify-center gap-6 mb-6">
          <Link to="/contact" className="hover:text-[var(--color-text-primary)] transition-colors font-medium">Contact</Link>
          <Link to="/privacy" className="hover:text-[var(--color-text-primary)] transition-colors font-medium">Privacy</Link>
        </div>
        <p>© 2026 WorkHive SaaS. Built for busy bees.</p>
      </footer>
    </div>
  );
};

export default Landing;
