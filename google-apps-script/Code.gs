const SPREADSHEET_ID = "1ljwdY6_YQs26N_ePMi5ELOS0OPKDvLTH6ABricfagT0";
const SHEET_NAME = "RSVP Responses";
const HEADERS = [
  "Submitted At",
  "Name",
  "Attendance",
  "Guests",
  "Message",
];

function cleanText(value, maximumLength) {
  if (typeof value !== "string") {
    return "";
  }

  const text = value.trim().slice(0, maximumLength);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return jsonResponse({ ok: true, service: "wedding-rsvp" });
}

function doPost(event) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    if (!event || !event.postData || !event.postData.contents) {
      throw new Error("Missing request body.");
    }

    const payload = JSON.parse(event.postData.contents);
    const submittedAt = cleanText(payload.submittedAt, 40);
    const name = cleanText(payload.name, 80);
    const attendance = cleanText(payload.attendance, 40);
    const guests = cleanText(payload.guests, 2);
    const message = cleanText(payload.message, 500);

    if (
      !submittedAt ||
      !name ||
      !["Joyfully accepts", "Regretfully declines"].includes(attendance) ||
      !/^[1-5]$/.test(guests)
    ) {
      throw new Error("Invalid RSVP details.");
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      submittedAt,
      name,
      attendance,
      guests,
      message,
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({
      ok: false,
      error: error instanceof Error ? error.message : "Unable to save RSVP.",
    });
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}
