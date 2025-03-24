document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('sourceCode');
    const copyButton = document.getElementById('copyButton');

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Change the button's background color to indicate success
            copyButton.style.backgroundColor = '#28a745'; // Green color for success
            copyButton.textContent = 'Copied!';

            // Revert the button back to its original state after 2 seconds
            setTimeout(() => {
                copyButton.style.backgroundColor = ''; // Reset to default
                copyButton.textContent = 'Copy All';
            }, 2000);
        }).catch((error) => {
            console.error('Error copying text to clipboard:', error);

            // Change the button's background color to indicate failure
            copyButton.style.backgroundColor = '#dc3545'; // Red color for failure
            copyButton.textContent = 'Failed!';

            // Revert the button back to its original state after 2 seconds
            setTimeout(() => {
                copyButton.style.backgroundColor = ''; // Reset to default
                copyButton.textContent = 'Copy All';
            }, 2000);
        });
    }

    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        // Execute a script in the active tab to retrieve filtered text content
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: () => {
                // Select all <span> elements with data-hook="review-body"
                const reviewBodies = document.querySelectorAll('span[data-hook="review-body"]');
                const texts = [];

                reviewBodies.forEach((reviewBody) => {
                    // Find the first child <span> inside the review body
                    const childSpan = reviewBody.querySelector('span');
                    if (childSpan) {
                        const text = childSpan.textContent.trim();
                        if (text) {
                            texts.push(text); // Add non-empty texts to the array
                        }
                    }
                });

                return texts.join('\n'); // Join texts with a single newline for readability
            }
        }).then((results) => {
            if (results && results[0] && results[0].result) {
                textarea.value = results[0].result; // Display the filtered text content

                // Add click event listener to the "Copy All" button
                copyButton.addEventListener('click', () => {
                    copyToClipboard(textarea.value);
                });
            } else {
                textarea.value = 'No matching <span data-hook="review-body"> elements found.';
                copyButton.disabled = true; // Disable the button if no text is available
            }
        }).catch((error) => {
            console.error('Error retrieving filtered text:', error);
            textarea.value = 'An error occurred while retrieving the text content.';
            copyButton.disabled = true; // Disable the button if there's an error
        });
    });
});