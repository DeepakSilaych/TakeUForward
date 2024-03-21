const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const redis = require('redis');
const axios = require('axios');

const app = express();

// MySQL database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'code_snippet_app'
});

const redisClient = redis.createClient();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to submit code snippets
app.post('/submit', async (req, res) => {
    const { username, code_language, stdin, source_code } = req.body;
    const sql = 'INSERT INTO code_snippets (username, code_language, stdin, source_code) VALUES (?, ?, ?, ?)';
    const values = [username, code_language, stdin, source_code];

    try {
        const result = await executeCode(source_code, code_language, stdin);
        if (result.stdout && result.stdout.trim() !== '') {
            console.log('Output from code execution:', result.stdout);
        }
    } catch (error) {
        console.error('Error executing code:', error.message);
    }

    connection.query(sql, values, (err) => {
        if (err) {
            console.error('Error inserting data into database: ', err);
            res.status(500).json({ error: 'Failed to submit code snippet' });
            return;
        }

        redisClient.del('code_snippets', (err, count) => {
            if (err) {
                console.error('Error clearing Redis cache: ', err);
            }
            console.log(`Cleared Redis cache (${count} keys deleted)`);
        });

        res.status(200).json({ message: 'Code snippet submitted successfully' });
    });
});

app.get('/code-snippets', (req, res) => {
    const redisKey = 'code_snippets';

    redisClient.get(redisKey, (err, cachedData) => {
        if (err) {
            console.error('Error retrieving data from Redis cache: ', err);
        }

        if (cachedData) {
            res.status(200).json(JSON.parse(cachedData));
        } else {
            const sql = 'SELECT username, code_language, stdin, LEFT(source_code, 100) as truncated_source_code, timestamp FROM code_snippets';
            connection.query(sql, (err, results) => {
                if (err) {
                    console.error('Error fetching data from database: ', err);
                    res.status(500).json({ error: 'Failed to fetch code snippets' });
                    return;
                }

                redisClient.setex(redisKey, 3600, JSON.stringify(results));
                res.status(200).json(results);
            });
        }
    });
});

app.use((err, req, res, next) => {
    console.error('Error occurred: ', err);
    res.status(500).json({ error: 'Internal server error' });
});

redisClient.on('connect', () => {
    console.log('Connected to Redis server');
});

redisClient.on('error', (err) => {
    console.error('Error connecting to Redis server: ', err);
});

async function executeCode(source_code, language_id, stdin) {
    try {
        const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
            source_code,
            language_id,
            stdin,
            expected_output: ''
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': 'your_rapidapi_key'
            }
        });
        const submissionId = response.data.token;
        const resultResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${submissionId}`, {
            headers: {
                'X-RapidAPI-Key': 'your_rapidapi_key'
            }
        });
        const result = resultResponse.data;
        return result;
    } catch (error) {
        throw new Error('Failed to execute code');
    }
}
