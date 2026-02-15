import { authConfig } from "@/config/auth";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authConfig);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorizes" },
                { status: 401 }
            );
        }
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: "User ID required" },
                { status: 400 }
            );
        }

        if (session.user.email === userId) {
            return NextResponse.json(
                { error: "Cannot follow yourself" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("follows")
            .insert({
                follower_id: session.user.email,
                following_id: userId
            });

            if (error) {
                console.error("Follow error:", error);
                return NextResponse.json(
                    { error: "Failed to follow" },
                    { status: 500 }
                );
            }

            return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Follow error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authConfig);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: "User ID required" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("follows")
            .delete()
            .eq("follower_id", session.user.email)
            .eq("following_id", userId);

        if (error) {
            console.error("Unfollow error:", error);
            return NextResponse.json(
                { error: "Failed to unfollow" },
                { status: 500 }
            );
        }

        return NextResponse.json({ succes: true });

    } catch (error) {
        console.error("Unfollow error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}