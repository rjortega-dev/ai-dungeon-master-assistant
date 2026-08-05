import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma/prisma";

const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(3).max(30),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid request.",
          errors: parsed.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const {
      email,
      password,
      username,
    } = parsed.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
            { email },
            { username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email already registered.",
        },
        {
          status: 409,
        }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        username,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    return NextResponse.json(
      {
        message: "Account created.",
        user,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}