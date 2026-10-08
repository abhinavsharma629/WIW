import { appendFile, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

type RsvpPayload = {
  name?: unknown;
  email?: unknown;
  attendance?: unknown;
  guests?: unknown;
  message?: unknown;
  company?: unknown;
};

const dataDirectory = path.join(process.cwd(), "data");
const responsesFile = path.join(dataDirectory, "rsvp-responses.csv");
const headers = [
  "Submitted At",
  "Name",
  "Email",
  "Attendance",
  "Guests",
  "Message",
].join(",");

let pendingWrite = Promise.resolve();

function cleanText(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function csvCell(value: string) {
  const safeValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

async function saveResponse(row: string) {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await stat(responsesFile);
  } catch {
    await writeFile(responsesFile, `${headers}\n`, "utf8");
  }

  await appendFile(responsesFile, `${row}\n`, "utf8");
}

export async function POST(request: Request) {
  let payload: RsvpPayload;

  try {
    payload = (await request.json()) as RsvpPayload;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (cleanText(payload.company, 100)) {
    return Response.json({ ok: true });
  }

  const name = cleanText(payload.name, 80);
  const email = cleanText(payload.email, 120);
  const attendance = cleanText(payload.attendance, 40);
  const guests = cleanText(payload.guests, 2);
  const message = cleanText(payload.message, 500);

  if (
    !name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !["Joyfully accepts", "Regretfully declines"].includes(attendance) ||
    !/^[1-5]$/.test(guests)
  ) {
    return Response.json({ error: "Please check the RSVP details." }, { status: 400 });
  }

  const row = [
    new Date().toISOString(),
    name,
    email,
    attendance,
    guests,
    message,
  ]
    .map(csvCell)
    .join(",");

  pendingWrite = pendingWrite.then(() => saveResponse(row));

  try {
    await pendingWrite;
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to save RSVP response.", error);
    return Response.json({ error: "Unable to save RSVP." }, { status: 500 });
  }
}
