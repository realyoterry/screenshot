chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'screenshot') {
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (image) => {
            if (chrome.runtime.lastError) {
                return console.error(chrome.runtime.lastError);
            }

            download(image);
        });
    }

    if (message.action === 'screenshotArea') {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, (image) => {
            sendResponse({ image });
        });

        return true;
    }

    if (message.action === 'download') {
        download(message.image);
    }
});

function download(image) {
    chrome.downloads.download({
        url: image,
        filename: `screenshot_${Date.now()}.png`,
    });
}
