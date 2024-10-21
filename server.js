const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let messages = []; // Массив для хранения сообщений

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Обработка WebSocket соединений
wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.send(JSON.stringify(messages)); // Отправка сообщений новому клиенту

    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'newMessage') {
            messages.push(parsedMessage.content); // Сохраняем сообщение
        }

        // Обновляем всех клиентов
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(messages));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Обработка запроса на главную страницу
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
