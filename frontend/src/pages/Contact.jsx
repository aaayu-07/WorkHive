import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <nav className="h-16 border-b border-[var(--color-border)]/50 backdrop-blur-md sticky top-0 z-50 flex items-center px-6 md:px-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-base)] flex items-center justify-center text-white font-bold">W</div>
          <span className="text-xl font-bold tracking-tight">WorkHive</span>
        </Link>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full py-16 px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Get in touch</h1>
          <p className="text-lg text-[var(--color-text-secondary)]">We'd love to hear from you. Please fill out this form.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-[var(--color-primary-base)] shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Chat to sales</h3>
                <p className="text-[var(--color-text-secondary)] mb-2">Speak to our friendly team.</p>
                <a href="mailto:sales@workhive.com" className="font-medium text-[var(--color-primary-base)] hover:underline">sales@workhive.com</a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Visit us</h3>
                <p className="text-[var(--color-text-secondary)] mb-2">Visit our office HQ.</p>
                <span className="font-medium">100 Innovation Drive, Tech City, TC 10020</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-3xl shadow-xl">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1.5">First name</label>
                  <input type="text" className="w-full bg-transparent border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2.5 px-4 outline-none transition-all" placeholder="First name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Last Name</label>
                  <input type="text" className="w-full bg-transparent border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2.5 px-4 outline-none transition-all" placeholder="Last name" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input type="email" className="w-full bg-transparent border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2.5 px-4 outline-none transition-all" placeholder="you@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Message</label>
                <textarea className="w-full bg-transparent border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2.5 px-4 outline-none transition-all h-32 resize-none" placeholder="Leave us a message..."></textarea>
              </div>
              <button type="button" className="w-full bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-light)] text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                Send Message <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
