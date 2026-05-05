import { useState, useEffect } from 'react';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchRecipes = async (isNewSearch = false) => {
    try {
      if (isNewSearch) setLoading(true);

      const currentPage = isNewSearch ? 0 : page;
      let url = `/recipes?search=${search}&page=${currentPage}&size=6`;

      if (category !== 'All') {
        url += `&category=${category}`;
      }

      const response = await api.get(url);

      if (isNewSearch) {
        setRecipes(response.data.content);
      } else {
        setRecipes((prevRecipes) => [...prevRecipes, ...response.data.content]);
      }

      // Spring Boot returns 'last' boolean to indicate if it's the final page
      setHasMore(!response.data.last);
    } catch (error) {
      console.error('Error fetching recipes', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fresh search when typing or changing category
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(0);
      fetchRecipes(true);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  // Trigger load more when page state increases
  useEffect(() => {
    if (page > 0) {
      fetchRecipes(false);
    }
  }, [page]);

  return (
      <div className="space-y-12 pb-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 px-8 py-20 md:py-28 text-center text-white shadow-2xl">
          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600 rounded-full blur-[120px]"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest uppercase bg-orange-500 rounded-full">
            The Foodie Community
          </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
              Cook. Share. <span className="text-orange-500 text-glow">Repeat.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed font-medium">
              Discover thousands of hand-picked recipes from home chefs around the world. Your next masterpiece starts here.
            </p>

            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
              <div className="relative flex items-center">
                <div className="absolute left-5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                    type="text"
                    placeholder="What would you like to cook today?"
                    className="w-full pl-14 pr-6 py-5 rounded-2xl text-gray-900 bg-white border-none shadow-xl focus:ring-0 text-lg font-medium placeholder:text-gray-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 px-2">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {search || category !== 'All' ? (
                    <span>Found <span className="text-orange-500">{recipes.length}</span> results {search && `for "${search}"`} {category !== 'All' && `in ${category}`}</span>
                ) : (
                    "Featured Recipes"
                )}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                Hand-picked selections for your daily meals
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'].map((cat) => (
                  <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-200 whitespace-nowrap ${
                          category === cat ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700'
                      }`}
                  >
                    {cat}
                  </button>
              ))}
            </div>
          </div>

          {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative w-20 h-20">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-orange-100 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-6 text-gray-400 font-bold animate-pulse">Sharpening the knives...</p>
              </div>
          ) : (
              <>
                {recipes.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                      </div>

                      {/* Load More Button */}
                      {hasMore && (
                          <div className="flex justify-center mt-12">
                            <button
                                onClick={() => setPage(page + 1)}
                                className="px-8 py-3 bg-gray-900 hover:bg-orange-500 text-white font-bold rounded-[1.5rem] transition-colors shadow-lg hover:shadow-orange-200"
                            >
                              Load More Recipes
                            </button>
                          </div>
                      )}
                    </>
                ) : (
                    <div className="text-center py-24 bg-gray-50 dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                      <div className="bg-white dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">No recipes found</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto font-medium">
                        We couldn't find anything matching your search. Try different keywords!
                      </p>
                      <button
                          onClick={() => setSearch('')}
                          className="mt-8 text-orange-500 font-bold hover:underline"
                      >
                        Clear search filters
                      </button>
                    </div>
                )}
              </>
          )}
        </section>
      </div>
  );
};

export default Home;