"use server";

import { createSession, readSession } from "@/lib/session";
import { db } from "@/db";
import { Otp, otp, User, user } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {
  authenticateSchema,
  Authenticate,
  verifyAccountSchema,
  VerifyAccount,
} from "./schemas";
import { Resend } from "resend";
import { EmailTemplate } from "@/email/template";
import argon2 from "argon2";
import { redirect } from "next/navigation";

const resend = new Resend(process.env.RESEND_KEY);

export async function sendOTPEmail(email: string, code: string) {
  await resend.emails.send({
    from: "Zartrack <onboarding@resend.dev>",
    to: [email],
    subject: "Zartrack - OTP Login",
    react: EmailTemplate({ email: email, code: code }),
  });
}

export async function authenticate(data: Authenticate) {
  const result = authenticateSchema.safeParse(data);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { email, password } = result.data;
  const existingUser = (
    await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .innerJoin(otp, eq(user.id, otp.userId))
  ).at(0);

  if (existingUser && existingUser.user.verified) {
    return await login(existingUser.user, password);
  }

  if (existingUser) {
    return await updateCreatedAccount(
      existingUser.user,
      existingUser.otp,
      password
    );
  }

  return await createAccount(email, password);
}

export async function verifyAccount(data: VerifyAccount) {
  const session = await readSession();

  if (!session) {
    return {
      errors: {
        code: ["You are not authorized"],
      },
    };
  }

  const result = verifyAccountSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { code } = result.data;

  const foundUser = (
    await db
      .select()
      .from(user)
      .innerJoin(otp, eq(user.id, otp.userId))
      .where(and(eq(user.id, session.userId), eq(otp.code, code)))
  ).at(0);

  if (!foundUser) {
    return {
      errors: {
        code: ["Wrong code"],
      },
    };
  }

  await db
    .update(user)
    .set({
      verified: true,
    })
    .where(eq(user.id, session.userId));
  await createSession(session.userId, session.email, true);
  return { message: "Successfully verified" };
}

function generateOTPData() {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // Expires in 30 minutes

  return { code, expiresAt };
}

async function login(existingUser: User, password: string) {
  const validPassword = await argon2.verify(existingUser.password, password);
  if (!validPassword) {
    return { errors: { password: ["Password or email is wrong"] } };
  }
  await createSession(existingUser.id, existingUser.email, true);
  redirect("/portfolio");
}

function isOTPExpired(expiresAt: Date) {
  return new Date() > new Date(expiresAt);
}

async function updateOTP(
  userId: string,
  { expiresAt, code }: { expiresAt: Date; code: string }
) {
  await db.update(otp).set({ expiresAt, code }).where(eq(otp.userId, userId));
}

async function createOTP(
  userId: string,
  { expiresAt, code }: { expiresAt: Date; code: string }
) {
  await db.insert(otp).values({ expiresAt, code, userId });
}

async function updateCreatedAccount(
  existingUser: User,
  otp: Otp,
  password: string
) {
  const hash = await argon2.hash(password);

  const updatedUser = (
    await db
      .update(user)
      .set({ password: hash })
      .where(eq(user.id, existingUser.id))
      .returning()
  ).at(0);

  if (!updatedUser) {
    return { errors: { email: ["Error updating user"] } };
  }

  const { expiresAt, code } = generateOTPData();

  await createOTP(updatedUser.id, { expiresAt, code });
  await createSession(updatedUser.id, updatedUser.email, false);

  if (isOTPExpired(otp.expiresAt)) {
    await updateOTP(updatedUser.id, { expiresAt, code });
    await sendOTPEmail(updatedUser.email, code);
  }

  return {
    message: "6-digit OTP is already sent to your email.",
  };
}

async function createAccount(email: string, password: string) {
  const hash = await argon2.hash(password);

  const createdUser = (
    await db.insert(user).values({ email, password: hash }).returning()
  ).at(0);

  if (!createdUser) {
    return { errors: { email: ["Error creating user"] } };
  }

  const { expiresAt, code } = generateOTPData();

  await createOTP(createdUser.id, { expiresAt, code });
  await createSession(createdUser.id, createdUser.email, false);
  await sendOTPEmail(createdUser.email, code);

  return {
    message:
      "Account created. An OTP has been sent to your email for verification.",
  };
}
