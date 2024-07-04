const puppeteer = require("puppeteer");

//This is the selecter we want to wait for
//It is the send button on Whatsapp
const sendBtn =
    "#main > footer > div._ak1k._ahmw.copyable-area > div > span:nth-child(2) > div > div._ak1r > div._ak1t._ak1u > button";

const send = async (params) => {
    try {
        //We are using the puppeteer package to automate sending the message

        let browser = null;
        let success = 0;
        let fail = 0;
        let total = 1;

        //Creating a browser to launch our urls from
        browser = await puppeteer.launch({
            headless: false,
        });

        //Creating a new page in that browser
        const page = await browser.newPage();

        // Set user agent to mimic a recent version of Chrome
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        );

        //Specifying that the page will not close after a certain period of time
        //Allows users to scan the QR code to login to Whatsapp comfortably
        page.setDefaultTimeout(0);

        //Looping through all the objects in the array
        for (let i = 0; i < params.length; i++) {
            //Extracing the message and number from request body
            const { message, number } = params[i];

            //If message or number are not present
            //We throw a bad request error
            if (!message || !number) {
                return {
                    status: "Failed",
                    error: "Message and Number are required",
                };
            }

            //Calculating the length of the message
            //If length is greater than 4096 we need to split the message into blocks and send each blocks individually
            //If not we can send the message in one request
            if (message.length > 4096) {
                const blocks = splitMessage(message, 4096);
                total = blocks.length;
                for (let i = 0; i < total; i++) {
                    const res = await sendTo({
                        message: blocks[i],
                        number,
                        page,
                    });
                    if (res === "success") success++;
                    else fail++;
                }
            } else {
                const res = await sendTo({
                    message,
                    number,
                    page,
                });
                if (res === "success") success++;
                else fail++;
            }
        }

        // //After we exit the loop we close the brower
        // //We close the browser
        await browser.close();

        //After successfully executing everything we handle it appropriately
        return {
            status: "Completed",
            total,
            totalSuccess: success,
            totalFail: fail,
        };
    } catch (error) {
        //If we encouter any error we cloes the brower
        await browser.close();
        //Any error which is encountered is caught here and the handled appropriately
        return {
            status: "Failed",
            error: "Internal Server Error",
            total,
            totalSuccess: success,
            totalFail: fail,
        };
    }
};

const sendTo = async (params) => {
    const { page, number, message } = params;
    try {
        //Going to the whatsapp url
        await page.goto(
            `https://web.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(
                message
            )}`
        );

        //Wait for the selector to appear in the DOM
        //After the selector is loaded in the DOM
        //We trigger the Enter to key to send the message
        await page.waitForSelector(sendBtn);
        await page.keyboard.press("Enter");

        //We wait for 2 seconds to ensure message is sent
        //To prevent rapid spamming as well
        await delay(2000);
        return "success";
    } catch {
        return "fail";
    }
};

//Function which is used to split the messages into individual blocks
const splitMessage = (message, size) => {
    const blocks = [];
    for (let i = 0; i < message.length; i += size) {
        blocks.push(message.slice(i, i + size));
    }
    return blocks;
};

// Function to create a delay using setTimeout wrapped in a Promise
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = { send };
