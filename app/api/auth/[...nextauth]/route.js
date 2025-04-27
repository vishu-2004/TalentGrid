import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { connect } from '@/utils/db'
import User from '@/models/User'
import bcrypt from "bcryptjs/dist/bcrypt"
import bcryptjs from "bcryptjs"

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",

            credentials: {
                email: { label: "email", type: "text", placeholder: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                let conn = await connect();
                try {
                  const user = await User.findOne({ email: credentials.email });
                  if (user && bcryptjs.compareSync(credentials.password, user.password)) {
                    return {
                      id: user._id,
                      name: user.name,
                      email: user.email,
                      role: user.role, // Ensure this is returned
                    };
                  }
                } catch (error) {
                  console.log(error);
                }
                return null;
              }              
        }),
    ],
    pages: {
        signIn: '/login', // Ensure this matches your custom login page
        error: '/login'   // Redirect to the same login page on error
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role; // Ensure role is passed in token
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role; // Ensure role is included in session
            }
            return session;
        }
    }
    
}
export const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }