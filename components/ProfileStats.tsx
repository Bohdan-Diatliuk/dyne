'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ProfileStatsProps {
  userId: string;
  initialFollowers: number;
  initialFollowing: number;
}

export default function ProfileStats({ 
  userId, 
  initialFollowers, 
  initialFollowing 
}: ProfileStatsProps) {
  const [followersCount, setFollowersCount] = useState(initialFollowers);
  const [followingCount, setFollowingCount] = useState(initialFollowing);
  const supabase = createClient();

  useEffect(() => {
    
    const channel = supabase
      .channel('follows-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'follows',
        },
        async (payload) => {

          if (payload.eventType === 'INSERT') {
            const newFollow = payload.new;
            
            if (newFollow.following_id === userId) {
              setFollowersCount(prev => prev + 1);
            }
            
            if (newFollow.follower_id === userId) {
              setFollowingCount(prev => prev + 1);
            }
          } else if (payload.eventType === 'DELETE') {
            const oldFollow = payload.old;
            
            if (oldFollow.following_id === userId) {
              setFollowersCount(prev => Math.max(0, prev - 1));
            }
            
            if (oldFollow.follower_id === userId) {
              setFollowingCount(prev => Math.max(0, prev - 1));
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Follows subscription status:', status);
      });

    return () => {
      console.log('🔌 Unsubscribing from follows channel');
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-zinc-800">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">0</p>
          <p className="text-gray-500 dark:text-gray-400">Posts</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{followersCount}</p>
          <p className="text-gray-500 dark:text-gray-400">Followers</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{followingCount}</p>
          <p className="text-gray-500 dark:text-gray-400">Following</p>
        </div>
      </div>
    </div>
  );
}