function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Check if the payload is for Wishes or RSVP
    if (payload.message !== undefined) {
      // It's a Wish
      let sheet = ss.getSheetByName("Wishes");
      if (!sheet) {
        sheet = ss.insertSheet("Wishes");
        sheet.appendRow(["Timestamp", "Name", "Message"]);
        // Make headers bold
        sheet.getRange(1, 1, 1, 3).setFontWeight("bold");
      }
      sheet.appendRow([
        payload.submittedAt || new Date().toISOString(), 
        payload.name || "Unknown", 
        payload.message
      ]);
    } else {
      // It's an RSVP
      let sheet = ss.getSheetByName("RSVP");
      if (!sheet) {
        sheet = ss.insertSheet("RSVP");
        sheet.appendRow(["Timestamp", "Primary Name", "Attendance", "Party Type", "Guest Count", "Primary Meal", "Additional Guests"]);
        // Make headers bold
        sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
      }

      // Check if it's the complex payload (App.tsx) or simple payload (StoryApp.tsx)
      if (payload.guests && payload.guests.length > 0) {
        // Complex payload from App.tsx
        let primaryName = payload.guests[0].name || "Unknown";
        let mealPref = payload.guests[0].meal || "N/A";
        
        let additionalGuests = "";
        if (payload.guests.length > 1) {
          additionalGuests = payload.guests.slice(1).map(g => `${g.name} (${g.meal})`).join(", ");
        }

        sheet.appendRow([
          payload.submittedAt || new Date().toISOString(),
          primaryName,
          payload.attendance,
          payload.partyType || "individual",
          payload.guestCount || 1,
          mealPref,
          additionalGuests
        ]);
      } else {
        // Simple payload from RSVPForm.tsx (StoryApp)
        sheet.appendRow([
          payload.submittedAt || new Date().toISOString(),
          payload.name || "Unknown",
          payload.attendance,
          "individual",
          1,
          "N/A",
          "N/A"
        ]);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
