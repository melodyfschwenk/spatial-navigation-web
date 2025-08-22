/** CONFIG **/ 
const SHEET_NAME = 'Sheet1';            // change if your sheet name differs
const GROUPS = ['DF','HF','DNF','HNF','HNS'];

/** Entry points **/
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const action = data.action || 'saveTrial';

    if (action === 'nextIdLocked')      return json(nextIdLocked_(data.groupCode));
    if (action === 'setCounter')        return json(setCounter_(data.groupCode, data.value));
    if (action === 'getCounters')       return json(getCounters_());
    if (action === 'rebuildCounters')   return json(rebuildCountersFromSheet_());

    // Default - save one trial row just like your current script
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
  ensureInitialsColumn_(sheet);
  const ts = new Date().toISOString();
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
    data.user_agent || ''
  ]);
}

// Ensure the sheet has a column for participant initials without overwriting existing data
function ensureInitialsColumn_(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (firstRow.indexOf('participant_initials') === -1) {
    sheet.insertColumnAfter(2);
    sheet.getRange(1, 3).setValue('participant_initials');
  }
}

/** ID counter with locking **/
function nextIdLocked_(group) {
  if (!group) return { ok: false, error: 'groupCode required' };

  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const props = PropertiesService.getScriptProperties();
    const key = 'counter_' + group;
    let n = parseInt(props.getProperty(key) || '0', 10);
    n = n + 1; // reserve the next number
    props.setProperty(key, String(n));
    return {
      ok: true,
      group: group,
      number: pad3_(n),
      id: group + '-online-' + pad3_(n)
    };
  } finally {
    lock.releaseLock();
  }
}

/** Admin utilities **/
function setCounter_(group, value) {
  if (!group) return { ok: false, error: 'groupCode required' };
  const n = parseInt(value, 10);
  if (isNaN(n) || n < 0) return { ok: false, error: 'value must be a non-negative integer' };
  PropertiesService.getScriptProperties().setProperty('counter_' + group, String(n));
  return { ok: true, group, value: n };
}

function getCounters_() {
  const props = PropertiesService.getScriptProperties().getProperties();
  const counters = {};
  GROUPS.forEach(g => counters[g] = parseInt(props['counter_' + g] || '0', 10));
  return { ok: true, counters: counters, maxima: scanMaximaFromSheet_() };
}

function rebuildCountersFromSheet_() {
  const maxima = scanMaximaFromSheet_();
  const props = PropertiesService.getScriptProperties();
  Object.keys(maxima).forEach(g => props.setProperty('counter_' + g, String(maxima[g])));
  return { ok: true, counters: maxima };
}

function scanMaximaFromSheet_() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const colParticipantId = 1; // zero-based, column B
  const reByGroup = {
    DF: /DF-online-(\d{1,})/i,
    HF: /HF-online-(\d{1,})/i,
    DNF:/DNF-online-(\d{1,})/i,
    HNF:/HNF-online-(\d{1,})/i,
    HNS:/HNS-online-(\d{1,})/i
  };
  const max = { DF:0, HF:0, DNF:0, HNF:0, HNS:0 };

  for (let i = 1; i < values.length; i++) { // start at 1 to skip header
    const pid = values[i][colParticipantId];
    if (!pid) continue;
    const s = String(pid);
    for (const g in reByGroup) {
      const m = s.match(reByGroup[g]);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n > max[g]) max[g] = n;
        break;
      }
    }
  }
  return max;
}

/** Utils **/
function pad3_(n) { return ('000' + n).slice(-3); }
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function initCounters() {
  // Scan the sheet and store maxima into script properties
  const res = rebuildCountersFromSheet_();
  Logger.log(res);
}

function showCounters() {
  // Log current stored counters and maxima
  const res = getCounters_();
  Logger.log(JSON.stringify(res));
}

