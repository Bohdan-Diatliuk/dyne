'use client';

import { useState, useEffect } from 'react';
import { UserPlus, UserMinus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';

interface FollowButtonProps {
  userId: string;
  initialIsFollowing: boolean;
  initialFollowers: number;
}

export default function FollowButton({ 
  userId, 
  initialIsFollowing,
  initialFollowers 
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowers);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const t = useTranslations("button");

  useEffect(() => {
    const channel = supabase
      .channel(`follows:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'follows',
          filter: `following_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Follow change:', payload);
          
          if (payload.eventType === 'INSERT') {
            setFollowersCount(prev => prev + 1);
          } else if (payload.eventType === 'DELETE') {
            setFollowersCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

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
            : 'bg-gray-500 text-white hover:bg-gray-300 hover:text-black'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isFollowing ? (
          <>
            <UserMinus size={18} />
            {t("unfollow")}
          </>
        ) : (
          <>
            <UserPlus size={18} />
            {t("follow")}
          </>
        )}
      </button>
    </div>
  );
}