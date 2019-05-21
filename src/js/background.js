
chrome.browserAction.onClicked.addListener((tab) => {
	chrome.tabs.create({
        url: "src/html/browser_action.html",
        index: tab.index + 1
    });
});

