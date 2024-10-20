const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let messages = []; // Массив для хранения сообщений

// Обработка WebSocket соединений
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Отправка существующих сообщений при подключении нового клиента
    ws.send(JSON.stringify(messages));

    // Обработка полученных сообщений
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message); // Парсинг сообщения

        if (parsedMessage.type === 'newMessage') {
            messages.push(parsedMessage.content); // Сохраняем новое сообщение
        } else if (parsedMessage.type === 'editMessage') {
            messages[parsedMessage.index] = parsedMessage.content; // Редактируем сообщение
        } else if (parsedMessage.type === 'deleteMessage') {
            messages.splice(parsedMessage.index, 1); // Удаляем сообщение
        }

        // Отправляем обновленный массив сообщений всем клиентам
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

// Настройка статических файлов
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
