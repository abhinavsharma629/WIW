import { appendFile, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

type RsvpPayload = {
  name?: unknown;
  attendance?: unknown;
  guests?: unknown;
  message?: unknown;
  company?: unknown;
};

type RsvpResponse = {
  submittedAt: string;
  name: string;
  attendance: string;
  guests: string;
  message: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const responsesFile = path.join(dataDirectory, "rsvp-responses.csv");
const googleSheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
const headers = [
  "Submitted At",
  "Name",
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

async function saveCsvResponse(row: string) {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await stat(responsesFile);
  } catch {
    await writeFile(responsesFile, `${headers}\n`, "utf8");
  }

  await appendFile(responsesFile, `${row}\n`, "utf8");
}

async function saveGoogleSheetResponse(response: RsvpResponse) {
  if (!googleSheetsWebhookUrl) {
    throw new Error("Google Sheets webhook URL is not configured.");
  }

  const webhookResponse = await fetch(googleSheetsWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response),
    cache: "no-store",
    redirect: "follow",
  });

  if (!webhookResponse.ok) {
    throw new Error(`Google Sheets webhook returned ${webhookResponse.status}.`);
  }

  let result: { ok?: unknown };

  try {
    result = (await webhookResponse.json()) as { ok?: unknown };
  } catch {
    throw new Error("Google Sheets webhook returned an invalid response.");
  }

  if (result.ok !== true) {
    throw new Error("Google Sheets webhook rejected the RSVP response.");
  }
}

async function saveResponse(response: RsvpResponse) {
  if (googleSheetsWebhookUrl) {
    await saveGoogleSheetResponse(response);
    return;
  }

  const row = [
    response.submittedAt,
    response.name,
    response.attendance,
    response.guests,
    response.message,
  ]
    .map(csvCell)
    .join(",");

  await saveCsvResponse(row);
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
  const attendance = cleanText(payload.attendance, 40);
  const guests = cleanText(payload.guests, 2);
  const message = cleanText(payload.message, 500);

  if (
    !name ||
    !["Joyfully accepts", "Regretfully declines"].includes(attendance) ||
    !/^[1-5]$/.test(guests)
  ) {
    return Response.json({ error: "Please check the RSVP details." }, { status: 400 });
  }

  const response = {
    submittedAt: new Date().toISOString(),
    name,
    attendance,
    guests,
    message,
  };

  pendingWrite = pendingWrite.then(
    () => saveResponse(response),
    () => saveResponse(response),
  );

  try {
    await pendingWrite;
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to save RSVP response.", error);
    return Response.json({ error: "Unable to save RSVP." }, { status: 500 });
  }
}
