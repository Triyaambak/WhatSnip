# WhatSnip

> WhatSnip is an **unofficial** API which is used to send large text messages(greater than Whatsapp input text limit) as well as send in bulk in Whatsapp

## Note

> It is **not** recommend to use WhatSnip in your company for legal reasons.

## How It Works ?

1. WhatSnip pop-ups a chrome window with the QR code for the user to log in to Whatsapp Web.
2. WhatSnip then checks if the message is to be sent to a single user or multiple users , the logic behind both remains the same.
3. WhatSnip then checks the message length and if the length of the message is greater than the limit of the text input field set by Whatsapp, it divides the entire message into fixed sized blocks and sends each block individually.
4. Finally , WhatSnip closes the chrome window and returns the result object

### DO NOT FORGET TO LOGOUT OUT FROM YOUR WHATSAPP APP

## Installation

```bash
> npm install whatsnip
> yarn add whatsnip
```

## Usage

```javascript
    const whatsnip = require("whatsnip");

    const inputParams = {
        number: "123456789", //Sample valid Whatsapp Phone Number
        message: "Sample", //Sample message to be sent
    }

    const result = await whatsnip.send(inputParams);

    //Sample result object

    {
        "status" : "Completed" // Or Failed
        "error" : "Internal Server Error" //If Failed
        "total" : 1 //Total number of blocks
        "totalSuccess" : 1 //Blocks successfully sent
        "totalFail" : 0 //Blocks not sent
    }

```

## Contributing

Feel free to create pull requests. For major changes, please open an issue first to discuss what you would like to change.

## LICENSE

This project is licensed under the [MIT License](LICENSE).
