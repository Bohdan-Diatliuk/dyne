'use client';

import { EditProfileProps } from "@/types/profile.interface";
import { Camera, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import  Image from 'next/image';

export default function EditProfile({ user, onClose }: EditProfileProps) {
    const [name, setName] = useState(user.name);
    const [username, setUsername] = useState(user.username);
    const [bio, setBio] = useState(user.bio || '');
    const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) return;

      if (!file.type.startsWith('image/')) {
        setError('Please select an image files');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setIsUploadingAvatar(true);
      setError('');

      try {
        const formData = new FormData();
        formData.append('file', file);

        const responce = await fetch('/api/users/avatar', {
          method: 'POST',
          body: formData,
        });

        if (responce.ok) {
          const data = await responce.json();
          setAvatarUrl(data.avatar_url);
        } else {
          const data = await responce.json();
          setError(data.error || 'Failed to upload avatar');
        }

      } catch (error) {
        console.error('Upload error:', error);
        setError('Failed to upload avatar');
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Name is required');
            return;
        }

        if (!username.trim()) {
          setError('Username is required');
          return;
        }

        setIsLoading(true);
        try {
            const usernameChanged = username !== user.username;
            
            const response = await fetch('/api/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name,
                  bio,
                  username: usernameChanged ? username : undefined,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                
                // Якщо username змінився, перенаправляємо на новий URL
                if (usernameChanged && data.user?.username) {
                    router.push(`/profile/${data.user.username}`);
                } else {
                    router.refresh();
                }
                
                onClose();
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Update error', error);
            setError('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center p-6">
          <div className="relative">
            {avatarUrl ? (
              <Image 
                src={avatarUrl}
                alt="Avatar"
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-[120px] h-[120px] rounded-full bg-gray-300 dark:bg-zinc-700 flex items-center justify-center">
                <Camera size={40} className="text-gray-500" />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isUploadingAvatar ? '...' : <Camera size={20} />}
            </button>
          </div>
          <input 
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Click camera icon to change avatar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg
                       bg-white dark:bg-zinc-800 text-foreground
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
              maxLength={50}
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input 
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg
                       bg-white dark:bg-zinc-800 text-foreground
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="username"
              maxLength={30}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Only lowercase letters, numbers and hyphens
            </p>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg
                       bg-white dark:bg-zinc-800 text-foreground
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       resize-none"
              placeholder="Tell us about yourself"
              rows={4}
              maxLength={160}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {bio?.length}/160
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg
                       hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg
                       hover:bg-blue-600 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || isUploadingAvatar}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
    );
}