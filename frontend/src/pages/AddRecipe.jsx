import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    title: '',
    instructions: '',
    category: 'Lunch',
    imageUrl: '',
    cookingTime: 30,
    ingredients: [''],
  });
  const navigate = useNavigate();

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ''] });
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean ingredients to prevent empty strings in database
      const cleanIngredients = formData.ingredients.filter(ing => ing.trim() !== '');

      if (cleanIngredients.length === 0) {
        toast.error('Please add at least one ingredient');
        return;
      }

      await api.post('/recipes', { ...formData, ingredients: cleanIngredients });
      toast.success('Recipe created successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to create recipe');
    }
  };

  return (
      <div className="max-w-4xl mx-auto pb-20">
        <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden relative">
          {/* Header Decor */}
          <div className="bg-gray-900 dark:bg-black px-10 py-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] bg-orange-500 rounded-full blur-[100px]"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white relative z-10 tracking-tight">
              Share Your <span className="text-orange-500">Masterpiece</span>
            </h2>
            <p className="text-gray-400 mt-4 font-medium relative z-10">
              Let the world taste your culinary creativity
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-10">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Recipe Title</label>
                  <input
                      type="text"
                      required
                      className="block w-full px-6 py-4 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl text-gray-900 dark:text-white font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      placeholder="e.g. Grandma's Secret Pasta Sauce"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Category</label>
                    <select
                        className="block w-full px-6 py-4 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option className="dark:bg-gray-900">Breakfast</option>
                      <option className="dark:bg-gray-900">Lunch</option>
                      <option className="dark:bg-gray-900">Dinner</option>
                      <option className="dark:bg-gray-900">Dessert</option>
                      <option className="dark:bg-gray-900">Snack</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Cooking Time (minutes)</label>
                    <input
                        type="number"
                        required
                        className="block w-full px-6 py-4 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl text-gray-900 dark:text-white font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        value={formData.cookingTime}
                        onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Image URL</label>
                  <input
                      type="text"
                      className="block w-full px-6 py-4 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl text-gray-900 dark:text-white font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      placeholder="Paste a link to a high-quality photo"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />

                  {/* Live Image Preview */}
                  {formData.imageUrl && (
                      <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 h-48 relative bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                        <img
                            src={formData.imageUrl}
                            alt="Recipe preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'block';
                            }}
                        />
                        <span className="text-gray-400 dark:text-gray-500 font-medium text-sm hidden absolute">Image preview unavailable</span>
                      </div>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* Ingredients Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">Ingredients</h3>
                </div>
                <button
                    type="button"
                    onClick={addIngredient}
                    disabled={formData.ingredients[formData.ingredients.length - 1]?.trim() === ''}
                    className="disabled:opacity-50 disabled:cursor-not-allowed bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-6 py-2.5 rounded-xl font-bold hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex space-x-2 group">
                      <input
                          type="text"
                          required={index === 0}
                          className="flex-1 px-6 py-4 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl text-gray-900 dark:text-white font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                          placeholder={`Ingredient ${index + 1}`}
                          value={ingredient}
                          onChange={(e) => handleIngredientChange(index, e.target.value)}
                      />
                      {formData.ingredients.length > 1 && (
                          <button
                              type="button"
                              onClick={() => removeIngredient(index)}
                              className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                      )}
                    </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* Instructions Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Cooking Steps</h3>
              </div>

              <textarea
                  required
                  className="block w-full px-6 py-6 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-[2rem] text-gray-900 dark:text-white font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all h-64 resize-none"
                  placeholder="Describe how to prepare this dish, step by step..."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              ></textarea>
            </div>

            <button
                type="submit"
                className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-xl font-black py-6 rounded-[2rem] hover:bg-orange-500 dark:hover:bg-orange-400 transition-all duration-300 shadow-2xl hover:shadow-orange-200 dark:hover:shadow-orange-900/20 transform hover:-translate-y-1 active:scale-95"
            >
              Publish Recipe
            </button>
          </form>
        </div>
      </div>
  );
};

export default AddRecipe;