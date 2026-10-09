import prisma from "@/lib/prisma";
import crypto from "crypto";

export function generateSecureToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

export async function getOrCreateCalendarToken(userId: string): Promise<string> {
  const existing = await prisma.calendarToken.findUnique({
    where: { userId },
  });

  if (existing) {
    return existing.token;
  }

  const newToken = generateSecureToken();
  const created = await prisma.calendarToken.create({
    data: {
      userId,
      token: newToken,
    },
  });

  return created.token;
}

export async function regenerateCalendarToken(userId: string): Promise<string> {
  const newToken = generateSecureToken();

  const upserted = await prisma.calendarToken.upsert({
    where: { userId },
    update: {
      token: newToken,
      updatedAt: new Date(),
    },
    create: {
      userId,
      token: newToken,
    },
  });

  return upserted.token;
}

export async function getUserIdFromToken(token: string): Promise<string | null> {
  const record = await prisma.calendarToken.findUnique({
    where: { token },
    select: { userId: true },
  });

  return record ? record.userId : null;
}
