const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, '../data/marketStore.json');
const REPORTS_PATH = path.join(__dirname, '../data/marketReports.json');

function ensureStoreFile() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify([]), 'utf8');
  }
  if (!fs.existsSync(REPORTS_PATH)) {
    fs.writeFileSync(REPORTS_PATH, JSON.stringify([]), 'utf8');
  }
}

function loadStoredListings() {
  try {
    ensureStoreFile();
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    return JSON.parse(raw) || [];
  } catch (err) {
    console.error('Error reading marketStore.json:', err);
    return [];
  }
}

function saveStoredListings(listings) {
  try {
    ensureStoreFile();
    fs.writeFileSync(STORE_PATH, JSON.stringify(listings, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing marketStore.json:', err);
  }
}

function loadStoredReports() {
  try {
    ensureStoreFile();
    const raw = fs.readFileSync(REPORTS_PATH, 'utf8');
    return JSON.parse(raw) || [];
  } catch (err) {
    console.error('Error reading marketReports.json:', err);
    return [];
  }
}

function saveStoredReports(reports) {
  try {
    ensureStoreFile();
    fs.writeFileSync(REPORTS_PATH, JSON.stringify(reports, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing marketReports.json:', err);
  }
}

module.exports = {
  loadStoredListings,
  saveStoredListings,
  loadStoredReports,
  saveStoredReports,
};
