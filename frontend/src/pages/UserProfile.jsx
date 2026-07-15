import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        setProfile(response.data);
        setIsFollowing(response.data.followedByCurrentUser);
        setFollowerCount(response.data.followerCount);
      } catch (error) {
        console.error('Error fetching profile', error);
        toast.error('User not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleFollowToggle = async () => {
    if (!user) {
      toast.error('Please login to follow users');
      return;
    }
    
    // Prevent self-follow via UI just in case
    if (user.id === parseInt(id)) {
      toast.error('You cannot follow yourself');
      return;
    }

    try {
      const res = await api.post(`/users/${id}/follow`);
      if (res.data.includes('Unfollowed')) {
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
        toast.success(`Unfollowed ${profile.name}`);
      } else {
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        toast.success(`Followed ${profile.name}`);
      }
    } catch (error) {
      toast.error('Failed to update follow status');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-orange-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-6 text-gray-400 font-bold animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (!profile) return <div className="text-center py-20 text-gray-500 font-bold">User not found.</div>;

  const isCurrentUser = user && user.id === parseInt(id);

  return (
    <div className="space-y-16 pb-20">
      <div className="glass rounded-[3rem] p-10 md:p-12 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-orange-50 dark:bg-orange-900/10 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10 text-center md:text-left">
          <div className="h-32 w-32 bg-orange-500 rounded-[2.5rem] flex items-center justify-center text-5xl text-white font-black shadow-xl shadow-orange-200 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            {profile.name[0].toUpperCase()}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{profile.name}</h1>
              <span className="inline-block px-4 py-1.5 text-xs font-black uppercase bg-gray-900 dark:bg-black text-white rounded-full tracking-widest w-fit mx-auto md:mx-0">
                {profile.role}
              </span>
            </div>
            
            <div className="flex items-center justify-center md:justify-start space-x-6 mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
              <div className="text-center md:text-left">
                <span className="block text-2xl font-black text-gray-900 dark:text-white">{profile.createdRecipes?.length || 0}</span>
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Recipes</span>
              </div>
              <div className="w-px h-8 bg-gray-100 dark:bg-gray-800"></div>
              <div className="text-center md:text-left">
                <span className="block text-2xl font-black text-gray-900 dark:text-white">{followerCount}</span>
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Followers</span>
              </div>
              <div className="w-px h-8 bg-gray-100 dark:bg-gray-800"></div>
              <div className="text-center md:text-left">
                <span className="block text-2xl font-black text-gray-900 dark:text-white">{profile.followingCount || 0}</span>
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Following</span>
              </div>
            </div>
          </div>

          {!isCurrentUser && (
            <button
              onClick={handleFollowToggle}
              className={`px-8 py-4 rounded-2xl font-black text-lg transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl ${
                isFollowing 
                ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-100 dark:shadow-orange-900/20'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{profile.name}'s Recipes</h2>
          </div>
        </div>
        
        {profile.createdRecipes?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {profile.createdRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">No recipes yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">{profile.name} hasn't shared any recipes.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserProfile;
