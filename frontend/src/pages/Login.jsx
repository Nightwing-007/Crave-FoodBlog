import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed!');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="glass max-w-md w-full space-y-8 p-10 rounded-[2.5rem] relative overflow-hidden transition-colors duration-300">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-orange-50 dark:bg-orange-950/20 rounded-full blur-3xl opacity-50"></div>

        <div className="relative">
          <h2 className="text-center text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
            Welcome <span className="text-orange-500">Back</span>
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 font-medium mb-10">
            Sign in to your account to continue
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-11 pr-4 py-4 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl text-gray-900 dark:text-white font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-11 pr-4 py-4 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl text-gray-900 dark:text-white font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-black rounded-2xl text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-orange-500 dark:hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 shadow-xl hover:shadow-orange-200 transform hover:-translate-y-1 active:scale-95"
            >
              Sign In
            </button>
          </form>

          {/* OAuth Divider */}
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 font-semibold">OR</span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={() => { toast('Google OAuth coming soon!', { icon: '🚀' }); }}
            className="mt-6 w-full flex items-center justify-center gap-3 py-4 px-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-750 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              New here?{' '}
              <Link to="/register" className="text-orange-500 font-black hover:underline underline-offset-4">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
