const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    if (req.method === 'POST') {
        const { id, balance } = req.body;

        const data = `UserID: ${id}, Balance: ${balance}\n`;
        const filePath = path.join(__dirname, 'userData.txt');

        fs.appendFile(filePath, data, (err) => {
            if (err) {
                res.status(500).json({ error: 'Failed to save data' });
                return;
            }
            res.status(200).json({ message: 'Data saved successfully' });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};