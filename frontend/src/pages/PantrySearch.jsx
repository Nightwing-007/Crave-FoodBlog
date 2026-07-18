import { useState } from 'react';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import toast from 'react-hot-toast';

const PantrySearch = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addIngredient();
    }
  };

  const addIngredient = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue('');
    }
  };

  const removeIngredient = (ingToRemove) => {
    setIngredients(ingredients.filter(ing => ing !== ingToRemove));
  };

  const handleSearch = async () => {
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }
    
    setLoading(true);
    setHasSearched(true);
    try {
      const query = ingredients.join(',');
      const response = await api.get(`/recipes/pantry?ingredients=${query}`);
      setRecipes(response.data);
    } catch (error) {
      toast.error('Failed to find recipes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Pantry <span className="text-orange-500">Search</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Tell us what ingredients you have in your kitchen, and we'll show you what delicious recipes you can make!
        </p>
      </div>

      <div className="max-w-3xl mx-auto glass rounded-3xl p-8 mb-12 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. tomato, chicken, rice (Press Enter to add)"
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-orange-500 transition-colors text-gray-800 dark:text-white"
            />
          </div>
          <button
            onClick={addIngredient}
            className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-2xl hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white transition-colors"
          >
            Add
          </button>
        </div>

        {ingredients.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">Your Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ing, index) => (
                <span
                  key={index}
                  className="flex items-center px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-bold rounded-xl"
                >
                  {ing}
                  <button
                    onClick={() => removeIngredient(ing)}
                    className="ml-2 hover:text-orange-900 dark:hover:text-orange-200 transition-colors focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSearch}
          disabled={loading || ingredients.length === 0}
          className={`w-full py-4 font-black rounded-2xl transition-all duration-300 ${
            ingredients.length > 0
              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 hover:-translate-y-1'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Searching...' : 'Find Recipes'}
        </button>
      </div>

      {hasSearched && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Results ({recipes.length})
          </h2>
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass rounded-3xl">
              <span className="text-4xl mb-4 block">😢</span>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No recipes found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adding more or different ingredients.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PantrySearch;
