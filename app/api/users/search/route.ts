import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/config/auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q");

    let supabaseQuery = supabase
      .from("users")
      .select("id, name, email, username, avatar_url")
      .limit(20);

    // Якщо є query, фільтруємо
    if (query && query.trim().length > 0) {
      supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,username.ilike.%${query}%`);
    }

    const { data: users, error } = await supabaseQuery;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Search failed" },
        { status: 500 }
      );
    }

    const formattedUsers = users?.map(user => ({
      id: user.id,
      username: user.username,
      name: user.name,
      image: user.avatar_url,
    })) || [];

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}