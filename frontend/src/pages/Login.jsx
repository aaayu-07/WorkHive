import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl p-8"
      >
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-[var(--color-primary-base)] rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-[var(--color-primary-base)]/20">
            W
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Welcome back</h2>
        <p className="text-[var(--color-text-secondary)] text-center mb-8">
          Enter your credentials to access your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2.5 pl-10 pr-4 outline-none transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2.5 pl-10 pr-4 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-light)] text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[var(--color-text-secondary)]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--color-primary-base)] hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
