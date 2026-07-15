import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
      <div className="glass group rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <img
              src={recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"}
              alt={recipe.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Badges */}
          <div className="absolute top-5 left-5 flex flex-col space-y-2">
            <span className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white text-xs font-black uppercase px-4 py-2 rounded-xl shadow-sm w-max">
              {recipe.category}
            </span>
            {recipe.difficulty && (
              <span className={`backdrop-blur-md text-xs font-black uppercase px-4 py-2 rounded-xl shadow-sm w-max text-white ${
                recipe.difficulty === 'EASY' ? 'bg-green-500/90' : 
                recipe.difficulty === 'MEDIUM' ? 'bg-yellow-500/90' : 'bg-red-500/90'
              }`}>
                {recipe.difficulty}
              </span>
            )}
          </div>

          {/* Quick Info */}
          <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
          <span className="flex items-center text-white text-sm font-bold bg-black/40 px-2 py-1 rounded-md backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {recipe.cookingTime} min
          </span>
          {recipe.averageRating > 0 && (
            <span className="flex items-center text-white text-sm font-bold bg-black/40 px-2 py-1 rounded-md backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f59e0b" className="w-4 h-4 mr-1">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {recipe.averageRating.toFixed(1)} ({recipe.reviewCount})
            </span>
          )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-orange-500 transition-colors">
            {recipe.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4 font-medium">
            {recipe.instructions ? recipe.instructions.replace(/<[^>]+>/g, '') : ''}
          </p>

          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {recipe.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-lg">
                  #{tag}
                </span>
              ))}
              {recipe.tags.length > 3 && (
                <span className="text-xs font-bold text-gray-400">+{recipe.tags.length - 3}</span>
              )}
            </div>
          )}

          <div className="pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
            <Link to={`/users/${recipe.creatorId}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-xs">
                {recipe.creatorName?.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">By {recipe.creatorName}</span>
            </Link>

            <Link
                to={`/recipes/${recipe.id}`}
                className="flex items-center text-gray-900 dark:text-gray-200 font-black text-sm group/btn"
            >
              View
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
  );
};

export default RecipeCard;