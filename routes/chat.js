const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authorization = require('../middleware/authorization');

// Route for showing list chat room
router.get('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const listChat = await pool.query(
            `SELECT *
                FROM (
                    SELECT DISTINCT ON (rc.id_room)
                        rc.id_room,
                        rc.person_1,
                        u1.username AS username_1,
                        rc.person_2,
                        u2.username AS username_2,
                        dc.time AS last_time,
                        dc.message AS last_message
                    FROM room_chat rc
                    LEFT JOIN detail_chat dc ON rc.id_room = dc.id_room
                    INNER JOIN user_data u1 ON rc.person_1 = u1.user_id
                    INNER JOIN user_data u2 ON rc.person_2 = u2.user_id
                    WHERE rc.person_1 = $1 OR rc.person_2 = $1
                    ORDER BY rc.id_room, dc.time DESC
                ) AS subquery
                ORDER BY (subquery.last_time IS NULL), subquery.last_time DESC;
                `,
            [id]
        );
        res.json(listChat.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route for detail chat room
router.get('/:user/:friend', authorization, async (req, res) => {
    try {
        const { user, friend } = req.params;
        const detailChat = await pool.query(
            `SELECT
                dc.id_chat,
                dc.time,
                dc.message,
                u1.username AS sender_username,
                u1.user_id AS sender_id,
                u2.username AS receiver_username,
                u2.user_id AS receiver_id
            FROM
                detail_chat dc
            INNER JOIN
                user_data u1 ON dc.sender = u1.user_id
            INNER JOIN
                user_data u2 ON dc.receiver = u2.user_id
            WHERE
                (u1.user_id = $1 AND u2.user_id = $2) OR (u1.user_id = $2 AND u2.user_id = $1)
            ORDER BY
                dc.time DESC;`,
            [user, friend]
        );
        res.json(detailChat.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add friend
router.post('/add/:user/:friend', authorization, async (req, res) => {
    try {
        const { user, friend } = req.params;
        const checkRoom = await pool.query(
            `SELECT EXISTS (
                SELECT 1
                FROM room_chat
                WHERE (person_1 = $1 AND person_2 = $2) OR (person_1 = $2 AND person_2 = $1)
            ) AS room_exists;`,
            [user, friend]
        );
        if (checkRoom.rows[0].room_exists) {
            res.json({ message: 'Room already exists' });
        } else {
            const addRoom = await pool.query(
                `INSERT INTO room_chat (person_1, person_2) VALUES ($1, $2);`,
                [user, friend]
            );

            res.json(addRoom.rows);
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Send message
// check and get existing room
// SELECT id_room FROM room_chat WHERE (person_1 = 3 AND person_2 = 4) OR (person_1 = 4 AND person_2 = 3);
// insert message
// INSERT INTO detail_chat (id_room, sender, receiver, message) VALUES (6, 3, 4, 'Assalamualaykum, look at the stars, look how they shine for you');
router.post('/send/:sender/:receiver', authorization, async (req, res) => {
    try {
        const { sender, receiver } = req.params;
        const { message } = req.body;
        const checkRoom = await pool.query(
            `SELECT id_room FROM room_chat WHERE (person_1 = $1 AND person_2 = $2) OR (person_1 = $2 AND person_2 = $1);`,
            [sender, receiver]
        );
        const idRoom = checkRoom.rows[0].id_room;

        const sendMessage = await pool.query(
            `INSERT INTO detail_chat (id_room, sender, receiver, message) VALUES ($1, $2, $3, $4);`,
            [idRoom, sender, receiver, message]
        );

        res.json(sendMessage.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;