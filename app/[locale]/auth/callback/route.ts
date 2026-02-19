import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createUsername } from '@/utils/createUsername';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/feed';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single();

        const hasNonLatin = /[^a-z0-9-]/.test(profile?.username || '');
        const isEmpty = !profile?.username;

        if (isEmpty || hasNonLatin) {
          const rawName = user.user_metadata?.full_name 
            || user.email?.split('@')[0] 
            || 'user';
          
          console.log('rawName:', rawName);
          
          let generatedUsername = createUsername(rawName);
          
          console.log('generatedUsername:', generatedUsername);

          if (!generatedUsername) {
            generatedUsername = `user-${user.id.slice(0, 8)}`;
          }

          const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('username', generatedUsername)
            .neq('id', user.id)
            .maybeSingle();

          if (existing) {
            generatedUsername = `${generatedUsername}-${Math.floor(Math.random() * 9999)}`;
          }

          const { error: updateError } = await supabase
            .from('users')
            .update({ username: generatedUsername })
            .eq('id', user.id);
            
          console.log('updateError:', updateError);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}