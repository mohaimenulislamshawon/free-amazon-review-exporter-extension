// Function to extract review texts
function extractReviewTexts() {
    const reviewTexts = new Set(); // Use a Set to store unique texts
    
    // Select all <span> elements with data-hook="review-body"
    const reviewBodies = document.querySelectorAll('span[data-hook="review-body"]');
    
    reviewBodies.forEach((reviewBody) => {
    // Find the first child <span> inside the review body
    const childSpan = reviewBody.querySelector('span');
    if (childSpan) {
    const text = childSpan.textContent.trim();
    if (text) {
    reviewTexts.add(text); // Add non-empty texts to the Set
    }
    }
    });
    
    return Array.from(reviewTexts); // Convert Set to Array
    }
    
    // Send extracted texts to the background script
    function sendTextsToBackground() {
    const texts = extractReviewTexts();
    chrome.runtime.sendMessage({ action: 'storeTexts', data: texts });
    }
    
    // Start observing the DOM for changes
    const observer = new MutationObserver(() => {
    sendTextsToBackground();
    });
    
    // Observe the entire document for changes
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Initial extraction when the script first runs
    sendTextsToBackground();