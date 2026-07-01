const themeBtn = document.getElementById("themeBtn")
const progressBar = document.querySelector(".progress-bar");
const progressText = document.getElementById("progressText");
const toast = document.getElementById("toast");
const input = document.getElementById("input");
const btn = document.getElementById("btn");
const taskList = document.getElementById("taskList");
const clearAll = document.getElementById("clearAll");
const searchInput = document.getElementById("searchInput");
const taskCount = document.getElementById("taskCount");

themeBtn.addEventListener("click" , ()=>{
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme" , "dark");
        themeBtn.textContent = "☀️"
    } else {
        localStorage.setItem("theme" , "light");
        themeBtn.textContent = "🌙"
    }
});

document.addEventListener("DOMContentLoaded", loadTasks);
btn.addEventListener("click", addTask);
input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

clearAll.addEventListener("click", () => {

    if (!confirm("Delete all tasks?")) return;

    taskList.innerHTML = "";
    saveTasks();
    updateProgress();
    updateCounter();
});
searchInput.addEventListener("keyup", searchTask);
function addTask() {
    const text = input.value.trim();
    if (text === "") {
        showToast("Please enter a task", "error");
        return;
    }
    createTask(text, false);
    input.value = "";
    saveTasks();
    updateProgress();
    updateCounter();
}

function createTask(text, completed) {
    const li = document.createElement("li");
    if (completed) {
        li.classList.add("completed");
    }
    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = text;
    const btnContainer = document.createElement("div");
    btnContainer.className = "btn-container";
    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.textContent = completed ? "Undo" : "Complete";
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    btnContainer.append(
        completeBtn,
        editBtn,
        deleteBtn
    );

    li.append(
        span,
        btnContainer
    );

    taskList.appendChild(li);


    completeBtn.addEventListener("click", () => {

        li.classList.toggle("completed");

        completeBtn.textContent =
            li.classList.contains("completed")
                ? "Undo"
                : "Complete";

        saveTasks();

        updateProgress();

    });


    deleteBtn.addEventListener("click", () => {

        li.remove();

        saveTasks();

        updateProgress();

        updateCounter();

    });


    editBtn.addEventListener("click", () => {

        const newText = prompt(
            "Edit task",
            span.textContent
        );

        if (newText === null) return;

        if (newText.trim() === "") return;

        span.textContent = newText.trim();

        saveTasks();
        updateProgress();

    });

}

function saveTasks() {

    const tasks = [];

    document.querySelectorAll("#taskList li").forEach(task => {

        tasks.push({

            text: task.querySelector(".task-text").textContent,

            completed: task.classList.contains("completed")

        });

    });

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
    updateProgress();

}
function loadTasks() {

    const data =
        JSON.parse(localStorage.getItem("tasks")) || [];

    data.forEach(task => {

        createTask(
            task.text,
            task.completed
        );

    });
    updateProgress();
    updateCounter();

}
function updateCounter() {

    const total =
        document.querySelectorAll("#taskList li").length;

    taskCount.textContent =
        `${total} Task${total !== 1 ? "s" : ""}`;

}
function searchTask() {

    const value =
        searchInput.value.toLowerCase();

    document.querySelectorAll("#taskList li")
        .forEach(task => {

            const text =
                task.querySelector(".task-text")
                    .textContent
                    .toLowerCase();

            task.style.display =
                text.includes(value)
                    ? "flex"
                    : "none";

        });

}
function showToast(message, type = "success") {
    
    toast.textContent = message;
    toast.className = "";
    toast.classList.add("show");
    if (type === "error") {
        toast.classList.add("error");
    }
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
    // showToast("All tasks deleted 🗑️");
    // showToast("Task added ✅");
    // showToast("Task deleted 🗑️");
    // showToast("Task updated ✏️");
    // showToast("Task completed 🎉");
}
function updateProgress() {

    const tasks = document.querySelectorAll("#taskList li");

    const completed = document.querySelectorAll("#taskList li.completed");

    const percent =
        tasks.length === 0
            ? 0
            : Math.round((completed.length / tasks.length) * 100);

    progressBar.style.width = percent + "%";

    progressText.textContent = percent + "% Completed";

}