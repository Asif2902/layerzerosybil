const fs = require('fs');
const path = require('path');

module.exports.loadUserData = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    const filePath = path.join(__dirname, '../users.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Failed to load data.' });
        }

        const users = data ? JSON.parse(data) : [];
        const userData = users.find(user => user.userId === userId);

        if (userData) {
            res.status(200).json(userData);
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    });
};