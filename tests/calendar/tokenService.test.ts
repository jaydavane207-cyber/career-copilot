import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  regenerateCalendarToken,
  getOrCreateCalendarToken,
} from "@/lib/calendar/tokenService";
import prisma from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  default: {
    calendarToken: {
      findUnique: vi.fn(),
      create: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

describe("Calendar Token Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("regenerating token creates a new distinct token and updates database", async () => {
    const oldToken = "initial-token-abc-123";
    let savedToken = oldToken;

    (prisma.calendarToken.upsert as any).mockImplementation(({ update }: any) => {
      savedToken = update.token;
      return Promise.resolve({
        id: "tok-1",
        userId: "user-999",
        token: update.token,
      });
    });

    const newToken = await regenerateCalendarToken("user-999");

    expect(prisma.calendarToken.upsert).toHaveBeenCalledTimes(1);
    expect(newToken).toBeDefined();
    expect(typeof newToken).toBe("string");
    expect(newToken.length).toBeGreaterThan(16);

    // Verify token changed
    expect(newToken).not.toBe(oldToken);
    expect(savedToken).toBe(newToken);
  });

  it("getOrCreateCalendarToken returns existing token if present", async () => {
    (prisma.calendarToken.findUnique as any).mockResolvedValue({
      id: "tok-1",
      userId: "user-888",
      token: "existing-secure-token-555",
    });

    const token = await getOrCreateCalendarToken("user-888");

    expect(token).toBe("existing-secure-token-555");
    expect(prisma.calendarToken.create).not.toHaveBeenCalled();
  });
});
