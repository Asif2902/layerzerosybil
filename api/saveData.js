const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/save-data', (req, res) => {
    const { tgUserId, balance, energy, walletAddress } = req.body;

    const data = `User ID: ${tgUserId}\nBalance: ${balance}\nEnergy: ${energy}\nWallet: ${walletAddress}\n`;
    
    fs.writeFile(`./user_data/${tgUserId}.txt`, data, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving data');
        }
        res.send('Data saved successfully');
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
