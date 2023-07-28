const express = require('express');
const router = express.Router();
const db = require('../../../database/mysql');

// GET all users
router.get('/', (req, res) => {
    db.query('SELECT * FROM POINT', (error, results) => {
        if (error) {
            console.error('Error retrieving users:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});

router.get('/:id', (req, res) => {
    const userId = req.params.id;
    db.query('SELECT * FROM POINT WHERE user_id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Error retrieving users:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});

router.get('/total_point', (req, res) => {
    db.query('SELECT login_id, name, total_point FROM USERS', (error, results) => {
        if (error) {
            console.error('Error retrieving users:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});

router.get('/total_point/:id', (req, res) => {
    const userId = req.params.id;
    db.query('SELECT login_id, name, total_point FROM USERS WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Error retrieving users:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
