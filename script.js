// Music
const relaxingMusic = new Audio('./sons/luna-rise-part-one.mp3');
relaxingMusic.volume = 0.8;
relaxingMusic.loop = true;

// AudioFX
const playAudioFX = new Audio('./sons/play.wav');
const pauseAudioFX = new Audio('./sons/pause.mp3');
const beepAudioFX = new Audio('./sons/beep.mp3');
const audioFxVolume = 0.4;
playAudioFX.volume = audioFxVolume;
pauseAudioFX.volume = audioFxVolume;
beepAudioFX.volume = audioFxVolume;

// Tag elements
const html = document.querySelector('html');
const bannerImg = document.querySelector('img.app__image');
const bannerTitle = document.querySelector('h1.app__title');
const timer = document.getElementById('timer');

// Buttons
const focusBtn = document.querySelector('.app__card-button--foco');
const shortRestBtn = document.querySelector('.app__card-button--descanso-curto');
const longRestBtn = document.querySelector('.app__card-button--descanso-longo');
const allButtons = document.querySelectorAll('.app__card-button');
const startBtn = document.getElementById('start-pause');
const startBtnIcon = startBtn.children[0];
const startBtnText = startBtn.children[1];

// Inputs
const musicCheckbox = document.getElementById('alternar-musica');

// Timer
let counterInSeconds = 1500;
let intervalId = null;

performeScript();

/**
 * Executes the script and sets up event listeners for various buttons and checkboxes.
 */
function performeScript() {
    handleEventListeners();
    handleCustomEventListeners();
}

/**
 * Handles the event listeners for the buttons and checkboxes.
 */
function handleEventListeners() {
    focusBtn.addEventListener('click', () => {
        changeContext('foco');
    });
    shortRestBtn.addEventListener('click', () => {
        changeContext('descanso-curto');
    });
    longRestBtn.addEventListener('click', () => {
        changeContext('descanso-longo');
    });
    musicCheckbox.addEventListener('change', toggleMusic);
    startBtn.addEventListener('click', () => {
        disablesButtonsWhenStartingTimer();
        startOrPauseTimer();
    });    
}

/**
 * Handles custom event listeners.
 */
function handleCustomEventListeners() {
    document.addEventListener('focusEnd', () => {
        disablesButtonsWhenTimerEnds('focusEnd')
        changeContext('descanso-curto');
    });
    document.addEventListener('restEnd', () => {
        disablesButtonsWhenTimerEnds('restEnd')
        changeContext('foco');
    });
}

/**
 * Disables or enables buttons based on the custom event received.
 * @param {string} customEvent - The custom event indicating the timer state ('focusEnd' or any other value).
 */
function disablesButtonsWhenTimerEnds(customEvent) {
    if (customEvent === 'focusEnd') {
        focusBtn.setAttribute('disabled', true);
        shortRestBtn.removeAttribute('disabled');
        longRestBtn.removeAttribute('disabled');
    } else {
        focusBtn.removeAttribute('disabled');
        shortRestBtn.setAttribute('disabled', true);
        longRestBtn.setAttribute('disabled', true);        
    }
}

/**
 * Disables buttons based on the current context when starting the timer.
 */
function disablesButtonsWhenStartingTimer() {
    const context = checksTheCurrentContext();
    if (context === 'foco') {
        shortRestBtn.setAttribute('disabled', true);
        longRestBtn.setAttribute('disabled', true);
    } else if (context === 'descanso-curto') {
        focusBtn.setAttribute('disabled', true);
        longRestBtn.setAttribute('disabled', true);
    } else if (context === 'descanso-longo') {
        focusBtn.setAttribute('disabled', true);
        shortRestBtn.setAttribute('disabled', true);
    }
}

/**
 * Function responsible for executing a countdown timer.
 * 
 * @returns {void}
 */
const countdownTimer = () => {
    if (checkIfTimerIsZero()) {
        createCustomEvent();
        stopTimer();
        playAudio(beepAudioFX);
        return;
    }
    decreasesCounterTime();
    showTime();
};

function createCustomEvent() {
    const context = checksTheCurrentContext();
    const event = {
        'foco': 'focusEnd',
        'descanso-curto': 'restEnd',
        'descanso-longo': 'restEnd'
    }

    const customEvent = new CustomEvent(event[context]);
    document.dispatchEvent(customEvent);    
}

function checksTheCurrentContext() {
    return html.getAttribute('data-contexto');
}

/**
 * Checks if the timer is zero.
 * @returns {boolean} True if the timer is zero, false otherwise.
 */
function checkIfTimerIsZero() {
    return counterInSeconds <= 0;
}

/**
 * Decreases the counter time by one second.
 */
function decreasesCounterTime() {
    counterInSeconds--;
}

/**
 * Starts or pause the timer.
 */
function startOrPauseTimer() {
    (checkIfTimerIsRunning() === true) ? stopTimer() : startTimer();
}

/**
 * Check if time is running.
 * @returns {boolean} Returns True if time is running, otherwise you return false.
 */
function checkIfTimerIsRunning() {
    return intervalId !== null
}

/**
 * Displays the countdown timer in the specified format.
 */
function showTime() {
    const time = new Date(counterInSeconds * 1000);
    const formattedTime = time.toLocaleTimeString(
        'pt-BR',
        { minute: '2-digit', second: '2-digit' }
    );

    timer.innerHTML = `${formattedTime}`;
}

/**
 * Updates the start button text and display based on the given text.
 * 
 * @param {string} text - The text to be displayed on the start button.
 */
function updateStartButton(text) {
    startBtnText.textContent = text;
    const images = {
        'Começar': './imagens/play_arrow.png',
        'Pausar': './imagens/pause.png'
    }
    startBtnIcon.setAttribute('src', images[text]);
}

/**
 * Starts the timer.
 */
function startTimer() {
    intervalId = setInterval(countdownTimer, 1000);
    updateStartButton('Pausar');
    playAudio(playAudioFX);
}

/**
 * Stops the timer by clearing the interval.
 */
function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
    updateStartButton('Começar');
    playAudio(pauseAudioFX);
}

/**
 * Toggles the music on/off.
 */
function toggleMusic() {
    if (musicCheckbox.checked) {
        playAudio(relaxingMusic);
    } else {
        pauseAudio(relaxingMusic);
    }
}

/**
 * Plays the selected audio.
 * @param {HTMLAudioElement} audio - The audio element representing the selected audio.
 */
function playAudio(audio) {
    audio.play();
}

/**
 * Pauses the selected audio.
 * @param {HTMLAudioElement} audio - The audio to be paused.
 */
function pauseAudio(audio) {
    audio.pause();
}

/**
 * Changes the context of the page.
 * @param {string} context - The new context to be set.
 */
function changeContext(context) {
    html.setAttribute('data-contexto', context);
    bannerImg.setAttribute('src', `./imagens/${context}.png`);
    updateBannerTitle(context);
    updateButtons(context);
    if (checkIfTimerIsRunning() === true) {
        stopTimer();
    }
    updateTimer(context);
    showTime();
}

/**
 * Updates the timer based on the given context.
 * @param {string} context - The context for the timer (e.g., 'foco', 'descanso-curto', 'descanso-longo').
 */
function updateTimer(context) {
    const durations = {
        'foco': 1500,
        'descanso-curto': 300,
        'descanso-longo': 900
    };

    counterInSeconds = durations[context];
}

/**
 * Updates the banner title based on the given context.
 * @param {string} context - The context for updating the banner title.
 */
function updateBannerTitle(context) {
    const titles = {
        'foco': 'Otimize sua produtividade,<br> <strong class="app__title-strong">mergulhe no que importa</strong>',
        'descanso-curto': 'Que tal dar uma respirada?<br> <strong class="app__title-strong">Faça uma pausa curta!</strong>',
        'descanso-longo': 'Hora de voltar à superfície.<br> <strong class="app__title-strong">Faça uma pausa longa.</strong>'
    };

    bannerTitle.innerHTML = titles[context];
}

/**
 * Updates the buttons based on the provided context.
 * @param {string} context - The context to update the buttons.
 */
function updateButtons(context) {
    allButtons.forEach(button => {
        if (button.classList.contains(`app__card-button--${context}`)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}


