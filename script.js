const colorChordMap = {
    red: 'Am',
    green: 'C',
    blue: 'F'
};
// Определите глобальную переменную для фоновой музыки
let backgroundMusic = new Audio('audio/background.mp3');
backgroundMusic.loop = true; // Зацикливание трека
backgroundMusic.volume = 0.5; // Установите уровень громкости, если необходимо

// Функция для начала воспроизведения фоновой музыки
function startBackgroundMusic() {
    backgroundMusic.play()
        .catch(e => {
            console.log("Не удалось начать воспроизведение фоновой музыки автоматически: " + e);
            // Для обхода политики автоматического воспроизведения в некоторых браузерах,
            // вы можете запросить пользователя нажать на страницу, чтобы начать воспроизведение.
        });
}

const audioSources = {
    red: ['audio/audio Am 1.mp3', 'audio/audio Am 2.mp3'],
    green: ['audio/audio C 1.mp3', 'audio/audio C 2.mp3'],
    blue: ['audio/audio F 1.mp3', 'audio/audio F 2.mp3']
};

let sounds = {
    red: [],
    green: [],
    blue: []
};



function preloadSounds() {
    for (let color in audioSources) {
        audioSources[color].forEach((src) => {
            const sound = new Audio(src);
            sound.preload = 'auto'; // Запрос на предзагрузку
            sound.load(); // Начинаем загрузку
            sounds[color].push(sound);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    preloadSounds();
    const square = document.getElementById('square');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let currentSound = null;
    const fadeStep = 0.05;
    const fadeInterval = 50;

    startBackgroundMusic();

    function fadeOut(sound, callback) {
        const fadeAudio = setInterval(() => {
            if (sound.volume > fadeStep) {
                sound.volume = Math.max(0, sound.volume - fadeStep);
            } else {
                clearInterval(fadeAudio);
                sound.pause();
                sound.currentTime = 0;
                sound.volume = 0.3; // Установить громкость обратно в 1 для следующего использования
                if (callback) {
                    callback(); // Вызов callback после того, как звук затух
                }
            }
        }, fadeInterval);
    }



    function playSound(color) {
        if (!sounds[color] || sounds[color].length === 0) {
            console.error('Аудиофайлы для цвета ' + color + ' не были загружены.');
            return; // Прекратить выполнение функции, если звуки не загружены
        }
        const soundIndex = Math.floor(Math.random() * sounds[color].length);
        const newSound = sounds[color][soundIndex];
        newSound.currentTime = 0; // Гарантируем, что звук начнётся с начала
        newSound.play(); // Начинаем воспроизведение нового звука немедленно

        // Если уже есть звук, который воспроизводится, начинаем его затухание
        if (currentSound && !currentSound.paused) {
            fadeOut(currentSound); // Вызываем fadeOut без callback
        }

        // Устанавливаем новый звук как текущий
        currentSound = newSound;

        // Добавляем эффект свечения
        square.classList.add('glowing');
        newSound.addEventListener('ended', () => {
            square.classList.remove('glowing'); // Удаление эффекта свечения после окончания звука
        }
        );
    }

    function fadeOut(sound) {
        let fadeVolume = sound.volume; // Начальная громкость звука
        const fade = setInterval(() => {
            if (fadeVolume > 0.1) {
                fadeVolume -= 0.05; // Уменьшаем громкость
                sound.volume = fadeVolume;
            } else {
                // Останавливаем интервал и звук, когда громкость достаточно мала
                clearInterval(fade);
                sound.pause();
                sound.currentTime = 0;
                sound.volume = 0.3
                    ; // Сбрасываем громкость для следующего использования
            }
        }, fadeInterval);
    }



    function moveSquare() {
        square.style.display = 'none'; // Скрываем квадрат сразу после клика
        setTimeout(() => {
            const colorKeys = Object.keys(colorChordMap);
            const randomColor = colorKeys[Math.floor(Math.random() * colorKeys.length)];
            square.className = randomColor; // применяем класс для цвета
            // square.style.backgroundColor = randomColor;
            square.textContent = colorChordMap[randomColor];
            square.style.left = `${Math.random() * (350 - square.offsetWidth)}px`;
            square.style.top = `${Math.random() * (350 - square.offsetHeight)}px`;
            square.style.display = 'block'; // Показываем квадрат снова после задержки
        }, 500); // Задержка в 500 мс
    }

    square.addEventListener('click', () => {
        const color = square.className; // Должно быть 'red', 'green' или 'blue'
        console.log('Квадрат кликнут, текущий класс:', color);

        console.log('Квадрат кликнут, текущий цвет:', square.style.backgroundColor);

        score += 1;
        scoreDisplay.innerText = `Очки: ${score}`;
        playSound(color);
        moveSquare();
    });


    moveSquare(); // Перемещаем квадрат в начале игры
});
