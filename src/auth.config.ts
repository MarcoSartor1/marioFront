import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';



export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },

  callbacks: {

    authorized({ auth, request: { nextUrl } }) {
      return true;
    },

    jwt({ token, user }) {
      if ( user ) {
        token.data = user;
        token.isEmailVerified = (user as any).emailVerified ?? null;
      }

      return token;
    },

    session({ session, token }) {
      session.user = token.data as any;
      (session.user as any).emailVerified = token.isEmailVerified;
      return session;
    },

  },

  providers: [

    Credentials({
      async authorize(credentials) {

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if ( !parsedCredentials.success ) return null;

        const { email, password } = parsedCredentials.data;

        try {
          const resp = await fetch(`${ process.env.API_URL }/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if ( resp.status === 429 ) throw new Error('RateLimitExceeded');
          if ( !resp.ok ) return null;

          const user = await resp.json();

          return user;
        } catch (error) {
          if ( (error as Error)?.message === 'RateLimitExceeded' ) throw error;
          return null;
        }
      },
    }),

  ]
}



export const {  signIn, signOut, auth, handlers } = NextAuth( authConfig );