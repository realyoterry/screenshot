document.getElementById('fullScreen').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'screenshot' });
});

document.getElementById('selectedArea').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["content.js"]
        });
    });
});
