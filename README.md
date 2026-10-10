

<div align="center">
	<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Hashmi & Zerlin
.
## Run locally,

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. (Optional) Set `GEMINI_API_KEY` in `.env.local`.
3. Start dev server: `npm run dev`

## RSVP -> Google Sheets

This app submits RSVP entries to Google Sheets via a Google Apps Script Web App..

### 1) Create Apps Script endpoint

Open your Google Sheet, then go to **Extensions -> Apps Script** and paste this into `Code.gs`:

```js
function doPost(e) {
	try {
		// Prefer FormData field `payload` (works without CORS), else use raw JSON body.
		var payloadText = (e && e.parameter && e.parameter.payload)
			? e.parameter.payload
			: (e && e.postData && e.postData.contents);

		if (!payloadText) throw new Error('No payload received');
		var data = JSON.parse(payloadText);

		var ss = SpreadsheetApp.openById('1Xcq898xdwwCalto6bwH-wVj2Yw4QmzGmjGUKaoLqV6Y');
		var sheet = ss.getSheetByName('RSVP') || ss.getSheets()[0];

		// Header (only if empty)
		if (sheet.getLastRow() === 0) {
			sheet.appendRow(['submittedAt', 'attendance', 'partyType', 'guestCount', 'guests', 'pageUrl', 'userAgent']);
		}

		sheet.appendRow([
			data.submittedAt || new Date().toISOString(),
			data.attendance || '',
			data.partyType || '',
			data.guestCount || 0,
			JSON.stringify(data.guests || []),
			data.pageUrl || '',
			data.userAgent || ''
		]);

		return ContentService.createTextOutput(JSON.stringify({ ok: true }))
			.setMimeType(ContentService.MimeType.JSON);
	} catch (err) {
		return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
			.setMimeType(ContentService.MimeType.JSON);
	}
}
```

Then deploy it:

1. **Deploy -> New deployment**
2. Select **Web app**
3. **Execute as:** Me
4. **Who has access:** Anyone
5. Click **Deploy**, then copy the Web App URL (ends with `/exec`)

### 2) Configure the frontend

Create `.env.local` and set:

`VITE_RSVP_ENDPOINT="https://script.google.com/macros/s/.../exec"`

Restart the dev server after changing env vars.

