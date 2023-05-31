import NextAuth from 'next-auth/next';
import { authOptions } from '@/configs/authOptions';

export default NextAuth(authOptions);
