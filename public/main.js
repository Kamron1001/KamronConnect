document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    try {
        const response = await fetch('/register', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            window.location.href = '/chat';
        } else {
            alert('Ошибка регистрации');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
});

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    try {
        const response = await fetch('/login', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            window.location.href = '/chat';
        } else {
            alert('Ошибка входа');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
});

if (document.getElementById('editProfileForm')) {
    document.getElementById('editProfileForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(this);

        try {
            const response = await fetch('/edit-profile', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Профиль обновлен');
            } else {
                alert('Ошибка обновления профиля');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    });
}
