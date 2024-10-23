const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const users = {};
const messages = [];

// WebSocket подключение
wss.on('connection', (ws, req) => {
    console.log('Новое подключение WebSocket');
    
    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);

            if (parsedMessage.type === 'newMessage') {
                const newMessage = {
                    text: parsedMessage.content,
                    user: parsedMessage.user, // Прямо передаём пользователя от клиента
                    icon: parsedMessage.icon  // Прямо передаём иконку от клиента
                };
                messages.push(newMessage);

                // Отправляем новое сообщение всем подключенным клиентам
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'newMessage', message: newMessage }));
                    }
                });
            }
        } catch (error) {
            console.error('Ошибка при обработке сообщения:', error);
        }
    });

    // Отправляем текущую историю сообщений новому пользователю
    ws.send(JSON.stringify({ type: 'welcome', messages }));
});

// Обработка регистрации
app.post('/register', upload.single('icon'), (req, res) => {
    const { username, password } = req.body;
    const iconPath = req.file ? req.file.path : null;

    if (Object.values(users).some(user => user.username === username)) {
        return res.status(400).send('Пользователь уже существует');
    }

    const userId = Date.now();
    users[userId] = { username, password, icon: iconPath };
    req.session.userId = userId;

    res.redirect('/chat.html');
});

// Обработка входа
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = Object.values(users).find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).send('Неверные данные для входа');
    }

    req.session.userId = Object.keys(users).find(id => users[id] === user);
    res.redirect('/chat.html');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
