// DOM Element References
const timeDisplay = document.getElementById('time');
const modeDisplay = document.getElementById('mode');
const startButton = document.getElementById('startBtn');
const pauseButton = document.getElementById('pauseBtn');
const resetButton = document.getElementById('resetBtn');
const pomodoroCount = document.getElementById('pomodoro-count');
const soundEnabled = document.getElementById('soundEnabled');
const workTimeInput = document.getElementById('workTime');
const shortBreakTimeInput = document.getElementById('shortBreakTime');
const longBreakTimeInput = document.getElementById('longBreakTime');

// State Variables
let timeLeft = workTimeInput.value * 60;  // Converts minutes to seconds
let timerId = null;  // Holds the interval ID
let currentMode = 'work';  // Tracks current timer mode
let completedPomodoros = 0;  // Tracks completed work sessions

// Audio setup for notifications
const audio = new Audio('data:audio/wav;base64,...'); // Base64 encoded beep sound

// Core Timer Functions
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const newTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Get old time
    const oldTime = timeDisplay.textContent;
    
    // Only add animation if the time has changed
    if (oldTime !== newTime) {
        // Create spans for each character
        const html = newTime.split('').map((digit, index) => {
            const isChanged = oldTime && digit !== oldTime[index];
            const className = isChanged ? 'digit changing' : 'digit';
            return `<span class="${className}">${digit}</span>`;
        }).join('');
        
        timeDisplay.innerHTML = html;
    }
}

function switchMode() {
    if (currentMode === 'work') {
        // After work session, increment counter and determine break type
        completedPomodoros++;
        pomodoroCount.textContent = completedPomodoros;
        
        if (completedPomodoros % 4 === 0) {
            // Long break after 4 work sessions
            currentMode = 'longBreak';
            timeLeft = longBreakTimeInput.value * 60;
            modeDisplay.textContent = 'Long Break';
        } else {
            // Regular short break
            currentMode = 'shortBreak';
            timeLeft = shortBreakTimeInput.value * 60;
            modeDisplay.textContent = 'Short Break';
        }
    } else {
        // Switch back to work mode after any break
        currentMode = 'work';
        timeLeft = workTimeInput.value * 60;
        modeDisplay.textContent = 'Work Time';
    }
    updateDisplay();
}

function startTimer() {
    if (timerId === null) {  // Prevent multiple timers
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                // Timer completed
                playSound();
                clearInterval(timerId);
                timerId = null;
                switchMode();
                startTimer(); // Auto-start next session
            }
        }, 1000);
        
        // Update button states
        startButton.disabled = true;
        pauseButton.disabled = false;
    }
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    startButton.disabled = false;
    pauseButton.disabled = true;
}

function resetTimer() {
    // Reset everything to initial work mode state
    clearInterval(timerId);
    timerId = null;
    currentMode = 'work';
    modeDisplay.textContent = 'Work Time';
    timeLeft = workTimeInput.value * 60;
    updateDisplay();
    startButton.disabled = false;
    pauseButton.disabled = true;
}

// Settings Management
function updateSettings() {
    if (timerId === null) {  // Only update if timer is not running
        // Update timeLeft based on current mode and new settings
        if (currentMode === 'work') {
            timeLeft = workTimeInput.value * 60;
        } else if (currentMode === 'shortBreak') {
            timeLeft = shortBreakTimeInput.value * 60;
        } else {
            timeLeft = longBreakTimeInput.value * 60;
        }
        updateDisplay();
    }
}

// Event Listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
workTimeInput.addEventListener('change', updateSettings);
shortBreakTimeInput.addEventListener('change', updateSettings);
longBreakTimeInput.addEventListener('change', updateSettings);

// Initial Setup
pauseButton.disabled = true;
updateDisplay(); 