const { StatusCodes } = require("http-status-codes");
const puppeteer = require("puppeteer");

const WhatSnip = async (req, res) => {
    //Extracing the message and number from request body
    const { message, number } = req.body;
    let browser = null;

    //If message or number are not present
    //We throw a bad request error
    if (!message || !number) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: "failed",
            error: "Message and number are required",
        });
    }

    //Calculating the length of the message
    //If length is greater than 4096 we need to split the message into blocks and send each blocks individually
    //If not we can send the message in one request
    const length = message.length;

    try {
        //We are using the puppeteer package to automate sending the message

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

        //Going to the whatsapp url
        await page.goto(
            `https://web.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(
                message
            )}`
        );

        //Specifying that the page will not close after a certain period of time
        //Allows users to scan the QR code to login to Whatsapp comfortably
        await page.setDefaultTimeout(0);

        //This is the selecter we want to wait for
        //It is the send button on Whatsapp
        const selector =
            "#main > footer > div._ak1k._ahmw.copyable-area > div > span:nth-child(2) > div > div._ak1r > div._ak1t._ak1u > button";

        //Wait for the selector to appear in the DOM
        //After the selector is loaded in the DOM
        //We trigger the Enter to key to send the message
        await page.waitForSelector(selector);
        await page.keyboard.press("Enter");

        //Waiting for Whatsapp to send the message and reload the page
        await page.waitForNavigation({ waitUntil: "networkidle2" });
        //Once the page is reloaded
        //Confirmed that the message is sent
        //We close the browser
        await browser.close();

        //After successfully executing everything we handle it appropriately
        res.status(StatusCodes.OK).json({ status: "success" });
    } catch {
        //If we encouter any error we cloes the brower
        await browser.close();
        //Any error which is encountered is caught here and the handled appropriately
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "failed",
        });
    }
};

module.exports = WhatSnip;
