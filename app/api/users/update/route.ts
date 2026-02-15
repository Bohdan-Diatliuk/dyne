import { authConfig } from "@/config/auth";
import { supabase } from "@/lib/supabase";
import { createUsername } from "@/utils/createUsername";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authConfig);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { name, bio, username } = await req.json();

        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {
            name: name.trim(),
            bio: bio?.trim() || null,
            updated_at: new Date().toISOString(),
        };

        if (username) {
            const generatedUsername = createUsername(username);

            const { data: existingUser } = await supabase
                .from("users")
                .select("id")
                .eq("username", generatedUsername)
                .neq("id", session.user.email)
                .single();
                
            if (existingUser) {
                return NextResponse.json(
                    { error: "Username already taken" },
                    { status: 400 }
                );
            }

            updateData.username = generatedUsername;
        }

        const { data, error } = await supabase
            .from("users")
            .update(updateData)
            .eq("id", session.user.email)
            .select()
            .single();

        if (error) {
            console.error("Update error", error);
            return NextResponse.json(
                { error: "Failed to update profile" },
                { status: 500 }
            );
        }

        return NextResponse.json({ user: data });

    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json(
            { error: "Internal server error"},
            { status: 500 }
        );
    }
}