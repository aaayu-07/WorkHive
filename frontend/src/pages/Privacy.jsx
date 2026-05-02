import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <nav className="h-16 border-b border-[var(--color-border)]/50 backdrop-blur-md sticky top-0 z-50 flex items-center px-6 md:px-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-base)] flex items-center justify-center text-white font-bold">W</div>
          <span className="text-xl font-bold tracking-tight">WorkHive</span>
        </Link>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto w-full py-16 px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Privacy Policy</h1>
          <p className="text-[var(--color-text-secondary)]">Last updated: May 1, 2026</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="prose prose-green dark:prose-invert max-w-none space-y-6 text-[var(--color-text-secondary)]">
          <p>
            At WorkHive, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our platform.
          </p>
          
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8 mb-4">1. Information We Collect</h2>
          <p>
            When you register for an account, we collect your name, email address, and encrypted password. As you use the service, we also collect data about your projects, tasks, and activity on the platform.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services. This includes authenticating your identity, resolving technical issues, and analyzing how our platform is used to inform future development.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8 mb-4">3. Data Sharing</h2>
          <p>
            We do not sell your personal information to third parties. We may share your data with trusted third-party service providers who assist us in operating our platform, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8 mb-4">4. Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. All sensitive information transmitted is encrypted via Secure Socket Layer (SSL) technology and stored securely.
          </p>

          <p className="mt-12 pt-8 border-t border-[var(--color-border)]">
            If you have questions about our privacy policy, please contact us at <a href="mailto:privacy@workhive.com" className="text-[var(--color-primary-base)] hover:underline">privacy@workhive.com</a>.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Privacy;
