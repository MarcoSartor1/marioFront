import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';



export const authConfig: NextAuthConfig = {
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
      }

      return token;
    },

    session({ session, token }) {
      session.user = token.data as any;
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

        // Delegar autenticación al backend NestJS
        const resp = await fetch(`${ process.env.API_URL }/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if ( !resp.ok ) return null;

        // El backend devuelve { id, name, email, role, token }
        const user = await resp.json();

        return user;
      },
    }),

  ]
}



export const {  signIn, signOut, auth, handlers } = NextAuth( authConfig );