const fs = require('fs');
const path = require('path');

module.exports.saveUserData = async (req, res) => {
    const { userId, balance, energy } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    const filePath = path.join(__dirname, '../users.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Failed to save data.' });
        }

        const users = data ? JSON.parse(data) : [];
        const userIndex = users.findIndex(user => user.userId === userId);

        if (userIndex >= 0) {
            users[userIndex].balance = balance;
            users[userIndex].energy = energy;
        } else {
            users.push({ userId, balance, energy });
        }

        fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).json({ error: 'Failed to save data.' });
            }

            res.status(200).json({ success: true });
        });
    });
};