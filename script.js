// === DİL DESTEĞİ ===
const lang = document.getElementById("language");

const texts = {
  tr: {
    header: "🎯 FocusFlow",
    subHeader: "Odaklan, planla, başar!",
    pomodoroTitle: "Pomodoro Zamanlayıcı",
    startBtn: "▶ Başlat",
    resetBtn: "↺ Sıfırla",
    taskPlaceholder: "Yeni görev ekle...",
    addBtn: "Ekle",
    alertDone: "⏰ Süre doldu! Tebrikler 🎉"
  },
  en: {
    header: "🎯 FocusFlow",
    subHeader: "Focus, plan, succeed!",
    pomodoroTitle: "Pomodoro Timer",
    startBtn: "▶ Start",
    resetBtn: "↺ Reset",
    taskPlaceholder: "Add new task...",
    addBtn: "Add",
    alertDone: "⏰ Time's up! Well done 🎉"
  }
};

lang.addEventListener("change", () => {
  const t = texts[lang.value];
  document.querySelector("header h1").textContent = t.header;
  document.querySelector("header p").textContent = t.subHeader;
  document.querySelector(".pomodoro h2").textContent = t.pomodoroTitle;
  document.getElementById("start").textContent = t.startBtn;
  document.getElementById("reset").textContent = t.resetBtn;
  document.getElementById("task-input").placeholder = t.taskPlaceholder;
  document.getElementById("add-task").textContent = t.addBtn;
});

// === POMODORO ===
let timer;
let timeLeft = 25 * 60;
let isRunning = false;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const durationSelect = document.getElementById("duration-select");

durationSelect.addEventListener("change", () => {
  if (!isRunning) {
    timeLeft = durationSelect.value * 60;
    updateTimerDisplay();
  }
});

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

function toggleTimer() {
  if (!isRunning) {
    isRunning = true;
    startBtn.textContent = texts[lang.value].startBtn.replace("▶","⏸");
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timer);
        alert(texts[lang.value].alertDone);
        isRunning = false;
        startBtn.textContent = texts[lang.value].startBtn;
      }
    },1000);
  } else {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = texts[lang.value].startBtn;
  }
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = durationSelect.value * 60;
  updateTimerDisplay();
  startBtn.textContent = texts[lang.value].startBtn;
}

startBtn.addEventListener("click", toggleTimer);
resetBtn.addEventListener("click", resetTimer);
updateTimerDisplay();

// === TO-DO ===
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task,i) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;
    if(task.completed) span.classList.add("completed");

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔";
    completeBtn.onclick = () => toggleComplete(i);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.onclick = () => deleteTask(i);

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
  localStorage.setItem("tasks",JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  if(!text) return;
  tasks.push({text,completed:false});
  taskInput.value="";
  renderTasks();
}

function toggleComplete(i){
  tasks[i].completed = !tasks[i].completed;
  renderTasks();
}

function deleteTask(i){
  tasks.splice(i,1);
  renderTasks();
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => e.key==="Enter" && addTask());
renderTasks();
