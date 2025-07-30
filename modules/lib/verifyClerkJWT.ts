import { jwtVerify } from "jose";
import { environment } from "@zuplo/runtime";

export async function verifyClerkJWT(authHeader?: string) {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing or malformed Authorization header");
  }

  const token = authHeader.replace("Bearer ", "");

  const key = new TextEncoder().encode(environment.CLERK_JWT_KEY);
  const { payload } = await jwtVerify(token, key);

  if (!payload.sub) {
    throw new Error("Invalid Clerk token");
  }

  return {
    userId: payload.sub,
    email: payload.email,
    ...payload,
  };
}
