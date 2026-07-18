import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

// Route-level code splitting — each page is loaded on demand
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const RecipeDetails = lazy(() => import('./pages/RecipeDetails'));
const AddRecipe = lazy(() => import('./pages/AddRecipe'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const PantrySearch = lazy(() => import('./pages/PantrySearch'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-orange-100 dark:border-gray-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin"></div>
      </div>
      <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 animate-pulse">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <Navbar />
        <main className="container mx-auto px-4 md:px-6 py-10">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/recipes/:id" element={<RecipeDetails />} />
              <Route path="/users/:id" element={<UserProfile />} />
              <Route path="/pantry" element={<PantrySearch />} />
              
              <Route path="/add-recipe" element={
                <ProtectedRoute>
                  <AddRecipe />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </ThemeProvider>
  );
}

export default App;
