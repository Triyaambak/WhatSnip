const express = require("express");
const WhatSnip = require("./Library/WhatSnip");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.post("/", WhatSnip);
app.get("/", (req, res) => {
    res.send("Default");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
