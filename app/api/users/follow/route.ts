import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    if (user.id === userId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    const { error } = await supabase
      .from("follows")
      .insert({
        follower_id: user.id,
        following_id: userId,
      });

    if (error) {
      console.error("Follow error:", error);
      return NextResponse.json({ error: "Failed to follow" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", userId);

    if (error) {
      console.error("Unfollow error:", error);
      return NextResponse.json({ error: "Failed to unfollow" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unfollow error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}