const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());

// Create the user_data directory if it doesn't exist
const userDataDir = path.join(__dirname, 'user_data');
if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir);
}

// Endpoint to save user data
app.post('/save-data', (req, res) => {
    const { tgUserId, balance, energy, walletAddress } = req.body;

    const data = `User ID: ${tgUserId}\nBalance: ${balance}\nEnergy: ${energy}\nWallet: ${walletAddress}\n`;
    
    const filePath = path.join(userDataDir, `${tgUserId}.txt`);

    fs.writeFile(filePath, data, (err) => {
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
