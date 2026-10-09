export interface InterviewForIcs {
  id: string;
  title: string;
  type: string;
  mode: string;
  scheduledStart: Date;
  durationMin: number;
  timezone?: string;
  meetingLink?: string | null;
  location?: string | null;
  notes?: string | null;
  application: {
    company: string;
    role: string;
  };
}

function formatDateToICS(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function buildInterviewIcs(interviews: InterviewForIcs[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Career Copilot//Interview Tracker//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Career Copilot Interviews",
    "X-WR-TIMEZONE:Asia/Kolkata",
  ];

  const nowIcs = formatDateToICS(new Date());

  for (const interview of interviews) {
    const start = new Date(interview.scheduledStart);
    const end = new Date(start.getTime() + interview.durationMin * 60 * 1000);

    const summary = `Interview: ${interview.application.company} — ${interview.title}`;

    const descriptionParts: string[] = [
      `Role: ${interview.application.role}`,
      `Type: ${interview.type}`,
      `Mode: ${interview.mode}`,
    ];
    if (interview.meetingLink) {
      descriptionParts.push(`Meeting Link: ${interview.meetingLink}`);
    }
    if (interview.notes) {
      descriptionParts.push(`Notes: ${interview.notes}`);
    }

    const description = descriptionParts.join("\\n");

    const location =
      interview.mode === "ONLINE"
        ? interview.meetingLink || "Online Meeting"
        : interview.location || "Office Location";

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:interview-${interview.id}@careercopilot.app`);
    lines.push(`DTSTAMP:${nowIcs}`);
    lines.push(`DTSTART:${formatDateToICS(start)}`);
    lines.push(`DTEND:${formatDateToICS(end)}`);
    lines.push(`SUMMARY:${escapeIcsText(summary)}`);
    lines.push(`DESCRIPTION:${description}`);
    lines.push(`LOCATION:${escapeIcsText(location)}`);
    lines.push("STATUS:CONFIRMED");
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  // RFC 5545 requires CRLF line endings
  return lines.join("\r\n");
}
