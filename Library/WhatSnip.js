const { StatusCodes } = require("http-status-codes");
const puppeteer = require("puppeteer");

const WhatSnip = async (req, res) => {
    const { message, number } = req.body;

    if (!message || !number) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: "failed",
            error: "Message and number are required",
        });
    }

    //https://web.whatsapp.com/send?phone=9449355568&text=Hi
    //https://web.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}

    const length = 20;
    // let blocks = 1;
    if (length <= 4096) {
        try {
            const browser = await puppeteer.launch({
                headless: false,
            });
            const page = await browser.newPage();

            // Set user agent to mimic a recent version of Chrome
            await page.setUserAgent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            );

            await page.goto(
                `https://web.whatsapp.com/send?phone=9449355568&text=Hi`
            );
            await page.setDefaultTimeout(0);
            await page.waitForSelector('[data-testid="search"]').then(() =>
                page.click('[data-testid="search"]', {
                    delay: 3000,
                })
            );

            // Navigate to the WhatsApp API URL

            // await page.screenshot({ path: "example.png" });
            // await browser.close();
            res.status(StatusCodes.OK).json({ status: "success" });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: "failed",
                error,
            });
        }
    }
};

module.exports = WhatSnip;
