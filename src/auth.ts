import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs";

import { prisma } from "./lib/prisma/prisma"

import { z } from "zod";

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [

        Credentials({

            credentials: {

                email: {
                    label: "Email",
                    type: "email",
                },

                password: {
                    label: "Password",
                    type: "password",
                },

            },

            async authorize(credentials) {

                // Authenticate the user here
                const parsed = LoginSchema.safeParse(credentials);

                if (!parsed.success) {
                    return null;
                }

                const { email, password } = parsed.data;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    return null;
                }

                const passwordMatches = await bcrypt.compare(
                    password,
                    user.passwordHash
                );

                if (!passwordMatches) {
                    return null;
                }

                return user;

            },

        }),

    ],

    callbacks: {

    async session({ session, user }) {
        if (session.user) {
            session.user.id = user.id;
        }

        return session;
    }

}
})