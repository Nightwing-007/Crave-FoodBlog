import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="glass sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="group-hover:scale-110 transition-transform duration-300">
              <img src={logo} alt="Crave Logo" className="h-10 w-auto" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              Crave
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-semibold transition-colors duration-200">Home</Link>
            {user ? (
              <>
                <Link to="/add-recipe" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-semibold transition-colors duration-200">Add Recipe</Link>
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-semibold transition-colors duration-200">Dashboard</Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-semibold transition-colors duration-200">Admin</Link>
                )}
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full capitalize">
                    👋 {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-500 dark:hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 transform active:scale-95"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 font-bold px-4 py-2 transition-colors">Login</Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-100 transition-all duration-300 transform active:scale-95"
                >
                  Join Now
                </Link>
              </div>
            )}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m3.343-5.657l.707.707m12.728 12.728l.707.707M6.343 17.657l-.707.707M17.657 6.343l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m3.343-5.657l.707.707m12.728 12.728l.707.707M6.343 17.657l-.707.707M17.657 6.343l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 font-semibold p-2">Home</Link>
              {user ? (
                <>
                  <Link to="/add-recipe" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 font-semibold p-2">Add Recipe</Link>
                  <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 font-semibold p-2">Dashboard</Link>
                  <button onClick={logout} className="w-full text-left text-orange-600 font-bold p-2 border-t border-gray-100 dark:border-gray-800">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 font-semibold p-2">Login</Link>
                  <Link to="/register" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold text-center">Join Now</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
