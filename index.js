const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Direct HTML response taaki blank screen na aaye
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Drake Panel</title>
        <style>
            body { background: #0f172a; color: #38bdf8; font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
            h1 { font-size: 2.5rem; }
        </style>
    </head>
    <body>
        <h1>Drake Panel is Live! 🚀</h1>
        <p>Aapka panel successfully chal raha hai.</p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
