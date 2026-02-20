'use client';

import { EditUserProps } from "@/types/profile.interface";
import { useState } from "react";
import EditProfile from "./EditProfile";
import { useTranslations } from "next-intl";

export default function EditProfileBtn({ user }: EditUserProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("profileEditBtn");

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors"
            >
                {t("edit")}
            </button>
            {isOpen && (
                <EditProfile 
                    user={user}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}