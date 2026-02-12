import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authConfig: AuthOptions = {
    // Без адаптера - використовуємо JWT
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async jwt({token, user, account}) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.picture = user.image;
            }
            return token;
        },
        async session({session, token}) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.image = token.picture as string;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) {
                return url;
            }
            return `${baseUrl}/feed`;
        }
    },
    pages: {
        signIn: "/",
    },
    secret: process.env.NEXTAUTH_SECRET,
}