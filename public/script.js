const ws = new WebSocket('ws://' + window.location.host);

ws.onmessage = function(event) {
    const messages = JSON.parse(event.data);
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = ''; // Очистить текущее содержимое

    messages.forEach((message, index) => {
        const msgElement = document.createElement('div');
        msgElement.textContent = message;

        // Добавляем кнопки редактирования и удаления
        const editButton = document.createElement('button');
        editButton.textContent = 'Редактировать';
        editButton.onclick = () => {
            const newMessage = prompt('Введите новое сообщение:', message);
            if (newMessage !== null) {
                ws.send(JSON.stringify({ type: 'editMessage', content: newMessage, index: index }));
            }
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.onclick = () => {
            ws.send(JSON.stringify({ type: 'deleteMessage', index: index }));
        };

        msgElement.appendChild(editButton);
        msgElement.appendChild(deleteButton);
        messagesDiv.appendChild(msgElement);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Прокрутка вниз
};

document.getElementById('sendMessage').onclick = function() {
    const input = document.getElementById('messageInput');
    const message = input.value;
    ws.send(JSON.stringify({ type: 'newMessage', content: message })); // Отправка нового сообщения
    input.value = ''; // Очистка поля ввода
};
