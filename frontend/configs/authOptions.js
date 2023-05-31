import CredentialsProvider from 'next-auth/providers/credentials';
import { loginApi } from '@/api/server/user-management/authentication-api';
import { writeToStorage } from '@/components/_functions/storage-variable-management';

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'User Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const apiResult = await loginApi(
          credentials.email,
          credentials.password
        );
        const user = apiResult.successStatus ? apiResult : null;

        if (user) {
          // return user;
          const userData = {
            id: user.id,
            email: user.email,
            username: user.username,
            usertype: user.usertype,
          };
          return {
            id: user.id,
            email: user.email,
            username: user.username,
            usertype: user.usertype,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      console.log('Session Callback', { session, token });

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          usertype: token.usertype,
          email: token.email,
        },
      };
    },
    jwt: ({ token, user }) => {
      console.log('JWT Callback', { token, user });
      if (user) {
        const u = user;
        return {
          ...token,
          id: u.id,
          username: u.username,
          usertype: u.usertype,
          email: u.email,
        };
      }
      return token;
    },
  },
};
