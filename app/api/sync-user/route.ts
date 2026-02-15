import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/config/auth'
import { createClient } from '@supabase/supabase-js'
import { createUsername } from '@/utils/createUsername'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST() {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.email!
    
    const { data: existingUserById } = await supabase
      .from('users')
      .select('id, username')
      .eq('id', userId)
      .single()

    let finalUsername: string

    if (existingUserById?.username && !existingUserById.username.startsWith('@')) {
      finalUsername = existingUserById.username
    } else {
      const baseUsername = createUsername(session.user.name || session.user.email!.split('@')[0])
      
      const { data: existingUserByUsername } = await supabase
        .from('users')
        .select('id, username')
        .eq('username', baseUsername)
        .neq('id', userId)
        .single()

      if (existingUserByUsername) {
        const randomSuffix = Math.floor(Math.random() * 9999)
        finalUsername = `${baseUsername}-${randomSuffix}`
      } else {
        finalUsername = baseUsername
      }
    }

    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: session.user.email,
        name: session.user.name,
        username: finalUsername,
        avatar_url: session.user.image,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ user: data })
  } catch (error) {
    console.error('Sync user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}