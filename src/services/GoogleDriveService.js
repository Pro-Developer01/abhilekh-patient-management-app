import { gapi } from 'gapi-script';

// Google API configuration
const API_KEY = 'YOUR_API_KEY'; // You'll need to provide this
const CLIENT_ID = 'YOUR_CLIENT_ID'; // You'll need to provide this
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest', 'https://sheets.googleapis.com/$discovery/rest?version=v4'];
const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets';

// Initialize the Google API client
export const initGoogleAPI = async () => {
  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        });
        
        // Check if user is signed in
        if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
          console.log('User not signed in');
        }
        
        resolve(true);
      } catch (error) {
        console.error('Error initializing Google API client', error);
        reject(error);
      }
    });
  });
};

// Sign in the user
export const signIn = async () => {
  try {
    const googleAuth = gapi.auth2.getAuthInstance();
    const user = await googleAuth.signIn();
    return user;
  } catch (error) {
    console.error('Error signing in', error);
    throw error;
  }
};

// Sign out the user
export const signOut = async () => {
  try {
    const googleAuth = gapi.auth2.getAuthInstance();
    await googleAuth.signOut();
  } catch (error) {
    console.error('Error signing out', error);
    throw error;
  }
};

// List Google Sheets files
export const listSheets = async () => {
  try {
    const response = await gapi.client.drive.files.list({
      q: "mimeType='application/vnd.google-apps.spreadsheet'",
      fields: 'files(id, name, webViewLink)',
    });
    
    return response.result.files;
  } catch (error) {
    console.error('Error listing sheets', error);
    throw error;
  }
};

// Select a spreadsheet and get its ID
export const selectSpreadsheet = (spreadsheetId) => {
  // Store the selected spreadsheet ID in localStorage
  localStorage.setItem('selectedSpreadsheetId', spreadsheetId);
  return spreadsheetId;
};

// Get the currently selected spreadsheet ID
export const getSelectedSpreadsheetId = () => {
  return localStorage.getItem('selectedSpreadsheetId');
};

// Check if user is signed in
export const isSignedIn = () => {
  if (!gapi.auth2) return false;
  return gapi.auth2.getAuthInstance().isSignedIn.get();
};

export default {
  initGoogleAPI,
  signIn,
  signOut,
  listSheets,
  selectSpreadsheet,
  getSelectedSpreadsheetId,
  isSignedIn,
}; 