chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

// chrome.action.onClicked.addListener(async (tab) => {
//     // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
//     const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
//     // Next state will always be the opposite
//     const nextState = prevState === 'ON' ? 'OFF' : 'ON'

//     // Set the action badge to the next state
//     await chrome.action.setBadgeText({
//       tabId: tab.id,
//       text: nextState,
//     });
//     if (nextState === "ON") {
//         // Run the contentScript
//         try {
//             await chrome.scripting.executeScript({
//             target: { tabId: tab.id },
//             files: ['contentScript.js']
//             });
//         } catch (error) {
//             console.error("Error injecting content script:", error);
//         }
//     }
// });