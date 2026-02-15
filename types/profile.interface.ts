export interface FollowProps {
    userId: string;
    initialIsFollowing: boolean;
    initialFollowers: number;
}

export interface EditProfileProps {
    user: {
        name: string;
        username: string;
        bio?: string | null;
        avatar_url?: string | null;
    };
    onClose: () => void;
}

export interface EditUserProps {
    user: {
        name: string;
        username: string;
        bio?: string | null;
        avatar_url?: string | null;
    }
}