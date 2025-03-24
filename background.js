// Load existing texts from storage or initialize an empty array
let storedTexts = [];

chrome.storage.local.get(['texts'], (result) => {
storedTexts = result.texts || [];
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
if (message.action === 'storeTexts') {
// Merge new texts with existing ones and remove duplicates
storedTexts = [...new Set([...storedTexts, ...message.data])];

// Save updated texts to storage
chrome.storage.local.set({ texts: storedTexts });
} else if (message.action === 'getTexts') {
sendResponse({ data: storedTexts });
} else if (message.action === 'clearTexts') {
storedTexts = [];
chrome.storage.local.set({ texts: [] });
sendResponse({ success: true });
}
});