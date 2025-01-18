import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
  userId: string;
  email: string;
  isLoggedin: boolean;
  expiresAt: Date;
};

type Session = {
  userId: string;
  email: string;
  expiresAt: string;
  isLoggedin: boolean;
  iat: number;
  exp: number;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (err) {
    console.error("err", err);
  }
}

export async function createSession(
  userId: string,
  email: string,
  isLoggedin: boolean
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, email, expiresAt, isLoggedin });

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
}

export async function readSession(): Promise<Session | undefined> {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return;
  const session = (await decrypt(cookie)) as Session | undefined;

  return session;
}

export async function deleteSession() {
  (await cookies()).delete("session");
}
