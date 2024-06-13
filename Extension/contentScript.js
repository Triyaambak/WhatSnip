//Send a chrome notification when contenScript gets loaded
Notification.requestPermission().then((result) => {
    //If the user has allowed permissions for notification
    //Send a notification
    //Else ignore
    if (result === 'granted') {
        const notification = new Notification("WhatSnip", {
            body: "WhatSnip is now active!"
        });
        //Automatically close the notification after 3 sec
        setTimeout(() => {
            notification.close();
        }, 3000);
    }
});

// Declaring variable to store Input-Box DOM Element and the value inside it
let inputBox = null;
let sendButton = null;
let inputValue = "";

// A mutation observer to check for dynamically rendered DOM-Elements
function handleMutation(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // Check if the added nodes are the desired elements
            for (let node of mutation.addedNodes) {
                // Check if the added node matches the selector of the desired element
                if (node.matches && node.matches("#main > footer > div._ak1k._ahmw.copyable-area > div > span:nth-child(2) > div > div._ak1r > div._ak1l > div > div > p > span")) {
                    inputBox = document.querySelector("#main > footer > div._ak1k._ahmw.copyable-area > div > span:nth-child(2) > div > div._ak1r > div._ak1l > div > div > p > span");
                    sendButton = document.querySelector("#main > footer > div._ak1k._ahmw.copyable-area > div > span:nth-child(2) > div > div._ak1r > div._ak1t._ak1u > button");
                    inputValue = inputBox.innerHTML;
                    console.log(inputBox);
                    console.log(sendButton);
                    observeInputBox();
                }
            }
        }
    }
}

// Create a new mutation observer
const observer = new MutationObserver(handleMutation);

// Configuration of the observer:
const config = { childList: true, subtree: true };

// Start observing the target node for configured mutations
observer.observe(document.body, config);

// Function to observe changes to the Input-Box Dom element
const observeInputBox = () => {
    const inputBoxObserver = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'characterData') {
                inputValue = inputBox.innerText;
                console.log("Input value changed:", inputBox.innerHTML);
                if (sendButton) {
                    sendButton.click();
                } else {
                    console.error("Send Button not found");
                }
            }
        }
    });

    // Observe changes to the text content of the span element
    inputBoxObserver.observe(inputBox, { characterData: true, subtree: true });
};

