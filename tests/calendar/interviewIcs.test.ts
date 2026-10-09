import { describe, it, expect } from "vitest";
import { buildInterviewIcs, InterviewForIcs } from "@/lib/calendar/interviewIcs";

describe("ICS Builder", () => {
  it("generates ICS output containing DTSTART, DTEND, and SUMMARY", () => {
    const mockInterviews: InterviewForIcs[] = [
      {
        id: "int-123",
        title: "System Design Round",
        type: "TECHNICAL",
        mode: "ONLINE",
        scheduledStart: new Date("2026-10-15T10:00:00.000Z"),
        durationMin: 60,
        meetingLink: "https://meet.google.com/abc-defg-hij",
        notes: "Prepare distributed rate limiter and database sharding",
        application: {
          company: "Stripe",
          role: "Senior Software Engineer",
        },
      },
    ];

    const icsResult = buildInterviewIcs(mockInterviews);

    // Verify minimum required fields
    expect(icsResult).toContain("DTSTART:");
    expect(icsResult).toContain("DTEND:");
    expect(icsResult).toContain("SUMMARY:Interview: Stripe — System Design Round");

    // Verify DTSTART and DTEND calculated correctly (10:00 to 11:00 UTC)
    expect(icsResult).toContain("DTSTART:20261015T100000Z");
    expect(icsResult).toContain("DTEND:20261015T110000Z");

    // Verify DESCRIPTION and LOCATION
    expect(icsResult).toContain("LOCATION:https://meet.google.com/abc-defg-hij");
    expect(icsResult).toContain("DESCRIPTION:Role: Senior Software Engineer\\nType: TECHNICAL\\nMode: ONLINE\\nMeeting Link: https://meet.google.com/abc-defg-hij\\nNotes: Prepare distributed rate limiter and database sharding");

    // Verify Calendar wrapping structure
    expect(icsResult).toContain("BEGIN:VCALENDAR");
    expect(icsResult).toContain("END:VCALENDAR");
    expect(icsResult).toContain("BEGIN:VEVENT");
    expect(icsResult).toContain("END:VEVENT");
  });

  it("handles offline interviews with physical locations", () => {
    const mockInterviews: InterviewForIcs[] = [
      {
        id: "int-456",
        title: "HR Culture Fit",
        type: "HR",
        mode: "OFFLINE",
        scheduledStart: new Date("2026-10-20T14:30:00.000Z"),
        durationMin: 45,
        location: "Bangalore Outer Ring Road Campus, Floor 5",
        application: {
          company: "Flipkart",
          role: "Engineering Manager",
        },
      },
    ];

    const icsResult = buildInterviewIcs(mockInterviews);

    expect(icsResult).toContain("DTSTART:20261020T143000Z");
    expect(icsResult).toContain("DTEND:20261020T151500Z");
    expect(icsResult).toContain("SUMMARY:Interview: Flipkart — HR Culture Fit");
    expect(icsResult).toContain("LOCATION:Bangalore Outer Ring Road Campus\\, Floor 5");
  });
});
