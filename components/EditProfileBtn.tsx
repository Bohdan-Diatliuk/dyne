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
                className="px-4 py-2 bg-btn-click text-main-text rounded-lg hover:bg-btn-hover transition-colors"
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