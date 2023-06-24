import CredentialsProvider from 'next-auth/providers/credentials';
import { loginApi } from '@/api/server/user-management/authentication-api';
import ChangePassword from 'pages/auth/change-password';

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
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
          return {
            id: user.id,
            email: user.email,
            username: user.username,
            usertype: user.usertype,
            passChangePending: user.passChangePending,
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
          passChangePending: token.passChangePending,
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
          passChangePending: u.passChangePending,
        };
      }
      return token;
    },
  },
  // pages: {
  //   signIn: '/auth/signin',
  // },
};
