/** CONFIG **/ 
const SHEET_NAME = 'Sheet1';            // change if your sheet name differs

/** Entry points **/
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    appendTrialRow_(data);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ status: 'API is working' });
}

/** Core helpers **/
function getSheet_() {
  // Use a named sheet if present, else fall back to the active one
  return SpreadsheetApp.getActive().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActiveSheet();
}

function appendTrialRow_(data) {
  const sheet = getSheet_();
  ensureColumns_(sheet);
  const ts = data.timestamp || new Date().toISOString();
  sheet.appendRow([
    ts,
    data.participant_id || '',
    data.participant_initials || '',
    data.participant_group || '',
    data.age || '',
    data.gender || '',
    data.handedness || '',
    data.block || '',
    data.trial || '',
    data.navigation_type || '',
    data.difficulty || '',
    data.stimulus_id || '',
    data.response || '',
    data.correct_response || '',
    data.accuracy,
    data.rt_ms,
    data.device_type || '',
    data.user_agent || ''
  ]);
}

// Ensure required columns exist without overwriting existing data
function ensureColumns_(sheet) {
  let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  if (headers.indexOf('participant_initials') === -1) {
    sheet.insertColumnAfter(2);
    sheet.getRange(1, 3).setValue('participant_initials');
    headers.splice(2, 0, 'participant_initials');
  }

  headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const uaIndex = headers.indexOf('user_agent');

  if (headers.indexOf('device_type') === -1) {
    if (uaIndex !== -1) {
      sheet.insertColumnBefore(uaIndex + 1);
      sheet.getRange(1, uaIndex + 1).setValue('device_type');
    } else {
      const lastCol = sheet.getLastColumn();
      sheet.insertColumnAfter(lastCol);
      sheet.getRange(1, lastCol + 1).setValue('device_type');
    }
  }

  if (uaIndex === -1) {
    const lastCol = sheet.getLastColumn();
    sheet.insertColumnAfter(lastCol);
    sheet.getRange(1, lastCol + 1).setValue('user_agent');
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

