import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ReviewSection from '../components/ReviewSection';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.get(`/recipes/${id}`);
        setRecipe(response.data);
      } catch (error) {
        toast.error('Failed to fetch recipe details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, navigate]);

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Please login to favorite recipes');
      return;
    }
    try {
      const response = await api.post(`/users/${id}/favorite`);
      toast.success(response.data);
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await api.delete(`/recipes/${id}`);
        toast.success('Recipe deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete recipe');
      }
    }
  };

  if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div></div>;
  if (!recipe) return null;

  return (
    <div className="max-w-4xl mx-auto glass rounded-3xl overflow-hidden transition-colors duration-300">
      <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-96 object-cover" />
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold uppercase px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                {recipe.category}
              </span>
              {recipe.difficulty && (
                <span className={`text-sm font-bold uppercase px-3 py-1 rounded-full text-white ${
                  recipe.difficulty === 'EASY' ? 'bg-green-500/90' : 
                  recipe.difficulty === 'MEDIUM' ? 'bg-yellow-500/90' : 'bg-red-500/90'
                }`}>
                  {recipe.difficulty}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mt-4">{recipe.title}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Created by <span className="font-semibold text-gray-700 dark:text-gray-200">{recipe.creatorName}</span> • {new Date(recipe.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: recipe.title,
                    text: `Check out this amazing recipe for ${recipe.title} on Crave Food Blog!`,
                    url: window.location.href,
                  }).catch((error) => console.log('Error sharing', error));
                } else {
                  toast.error('Sharing is not supported on this browser');
                }
              }}
              className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition duration-200"
              title="Share Recipe"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button
              onClick={handleFavorite}
              className="bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 p-3 rounded-xl hover:bg-pink-100 dark:hover:bg-pink-900/40 transition duration-200"
              title="Add to Favorites"
            >
              ❤️
            </button>
            {(user && (user.id === recipe.creatorId || user.role === 'ADMIN')) && (
              <button
                onClick={handleDelete}
                className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition duration-200"
                title="Delete Recipe"
              >
                🗑️
              </button>
            )}
          </div>
        </div>

        <div className="flex space-x-8 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⏱️</span>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Cooking Time</p>
              <p className="font-bold text-gray-800 dark:text-gray-200">{recipe.cookingTime} mins</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🥗</span>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Ingredients</p>
              <p className="font-bold text-gray-800 dark:text-gray-200">{recipe.ingredients.length} items</p>
            </div>
          </div>
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <span key={index} className="text-sm font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Ingredients</h3>
            <ul className="space-y-3">
              {recipe.ingredients.map((ing, index) => (
                <li key={index} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <span className="h-2 w-2 bg-orange-500 rounded-full"></span>
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Instructions</h3>
            <div 
              className="prose prose-orange dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: recipe.instructions }}
            />
          </div>
        </div>

        <ReviewSection recipeId={recipe.id} />
      </div>
    </div>
  );
};

export default RecipeDetails;
