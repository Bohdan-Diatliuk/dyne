import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createUsername } from "@/utils/createUsername";

export async function PUT(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
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

            const { data: existingUser, error: checkError } = await supabase
                .from("users")
                .select("id")
                .eq("username", generatedUsername)
                .neq("id", user.id)
                .maybeSingle();

            if (checkError) {
                return NextResponse.json(
                    { error: "Failed to check username" },
                    { status: 500 }
                );
            }

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
            .eq("id", user.id)
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