import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('recipes'); // 'recipes' or 'users'
  const [loading, setLoading] = useState(true);

  const fetchAllRecipes = async () => {
    try {
      const response = await api.get('/recipes?size=100');
      setRecipes(response.data.content);
    } catch (error) {
      toast.error('Failed to fetch recipes');
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchAllRecipes(), fetchAllUsers()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteRecipe = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      try {
        await api.delete(`/recipes/${id}`);
        toast.success('Recipe deleted successfully');
        setRecipes(recipes.filter(r => r.id !== id));
      } catch (error) {
        toast.error('Failed to delete recipe');
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? All their recipes will also be removed.')) {
      try {
        await api.delete(`/admin/users/${id}`);
        toast.success('User deleted successfully');
        setUsers(users.filter(u => u.id !== id));
        // Refresh recipes as well since user's recipes are deleted
        fetchAllRecipes();
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete user';
        toast.error(message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-orange-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-6 text-gray-400 font-bold animate-pulse">Accessing archives...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Admin <span className="text-orange-500">Control</span></h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Manage and moderate all platform content</p>
      </div>
      
      {/* Tab Switcher */}
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl">
        <button 
          onClick={() => setActiveTab('recipes')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'recipes' ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          Recipes
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'users' ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          Users
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="bg-white dark:bg-gray-900 px-6 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
            {activeTab === 'recipes' ? 'Total Recipes' : 'Total Users'}
          </span>
          <span className="text-2xl font-black text-gray-900 dark:text-white">
            {activeTab === 'recipes' ? recipes.length : users.length}
          </span>
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        {activeTab === 'recipes' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 dark:bg-black">
                <th className="py-6 px-8 font-black text-white uppercase text-xs tracking-widest">Recipe Details</th>
                <th className="py-6 px-8 font-black text-white uppercase text-xs tracking-widest">Category</th>
                <th className="py-6 px-8 font-black text-white uppercase text-xs tracking-widest">Creator</th>
                <th className="py-6 px-8 font-black text-white uppercase text-xs tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-colors group">
                  <td className="py-6 px-8">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                        <img 
                          src={recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=80"} 
                          alt="" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-gray-900 dark:text-gray-100 font-bold text-lg group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{recipe.title}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-black uppercase rounded-full tracking-wider">
                      {recipe.category}
                    </span>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 text-[10px] font-black">
                        {recipe.creatorName?.charAt(0) || 'U'}
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 font-bold">{recipe.creatorName}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <button
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 dark:bg-black">
                <th className="py-6 px-8 font-black text-white uppercase text-xs tracking-widest">User Info</th>
                <th className="py-6 px-8 font-black text-white uppercase text-xs tracking-widest">Email</th>
                <th className="py-6 px-8 font-black text-white uppercase text-xs tracking-widest">Role</th>
                <th className="py-6 px-8 font-black text-white uppercase text-xs tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {users.map((userItem) => (
                <tr key={userItem.id} className="hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-colors group">
                  <td className="py-6 px-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-black">
                        {userItem.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-gray-900 dark:text-gray-100 font-bold text-lg group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{userItem.name}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">{userItem.email}</span>
                  </td>
                  <td className="py-6 px-8">
                    <span className={`px-4 py-1.5 text-xs font-black uppercase rounded-full tracking-wider ${userItem.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                      {userItem.role}
                    </span>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <button
                      onClick={() => handleDeleteUser(userItem.id)}
                      disabled={userItem.role === 'ADMIN'}
                      className={`inline-flex items-center px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 ${userItem.role === 'ADMIN' ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-600 hover:text-white'}`}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {((activeTab === 'recipes' && recipes.length === 0) || (activeTab === 'users' && users.length === 0)) && (
          <div className="py-20 text-center">
            <div className="bg-gray-50 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">No records found</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">The platform is currently empty.</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;
