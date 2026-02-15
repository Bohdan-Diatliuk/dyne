'use client';

import { useState } from 'react';
import { UserPlus, UserMinus } from 'lucide-react';
import { FollowProps } from '@/types/profile.interface';

export default function FollowButton({ 
  userId, 
  initialIsFollowing,
  initialFollowers 
}: FollowProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowers);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/follow', {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Follow error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleFollow}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
          ${isFollowing 
            ? 'bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-700' 
            : 'bg-blue-500 text-white hover:bg-gray-600'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isFollowing ? (
          <>
            <UserMinus size={18} />
            Unfollow
          </>
        ) : (
          <>
            <UserPlus size={18} />
            Follow
          </>
        )}
      </button>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
      </span>
    </div>
  );
}