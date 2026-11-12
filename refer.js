
const input = document.querySelector("#task-inp");
const form = document.querySelector("form");
const list = document.querySelector("#tasks");
const error = document.querySelector("#err-msg");

const STORAGE_KEY = "tasks";

// Load saved tasks when the app starts
let tasks = loadTasks();

renderTasks();

// Add a new task
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const text = input.value.trim();

    if (text === "") {
        showError("Please Enter a Task");
        return;
    }

    removeError();

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveToLocalStorage();
    renderTasks();

    form.reset();
});

// Save the tasks array to localStorage
function saveToLocalStorage() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (savedTasks === null) {
        return [];
    }

    try {
        const parsedTasks = JSON.parse(savedTasks);

        return Array.isArray(parsedTasks) ? parsedTasks : [];
    } catch (error) {
        console.error("Could not load saved tasks:", error);
        return [];
    }
}

// Display all tasks on the page
function renderTasks() {
    list.innerHTML = "";

    tasks.forEach(function (item) {
        const task = document.createElement("li");

        task.className =
            "mb-2 w-full p-2 border-2 border-[#E7E9EF] rounded-full flex justify-between items-center";

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className =
            "size-5 checked:bg-[#6C5CE7] appearance-none rounded-full border-2 border-[#C8CBD4] checked:border-[#6C5CE7] checked:scale-[1.1] bg-transparent checked:before:content-['✓'] checked:before:text-white checked:before:text-[12px] checked:before:font-bold checked:before:flex checked:before:items-center checked:before:justify-center";

        checkbox.checked = item.completed;

        const span = document.createElement("span");

        span.textContent = item.text;
        span.className = "grow ml-3";

        if (item.completed) {
            span.classList.add("line-through", "opacity-50");
        }

        // Update completion status
        checkbox.addEventListener("change", function () {
            item.completed = checkbox.checked;

            saveToLocalStorage();
            renderTasks();
        });

        const del = document.createElement("button");

        del.innerHTML =
            '<ion-icon name="trash-outline"></ion-icon>';

        del.type = "button";

        del.className =
            "size-8 bg-[#D64545] hover:scale-[1.1] rounded-full text-white cursor-pointer text-[14px] flex justify-center items-center";

        // Delete task from data and storage
        del.addEventListener("click", function () {
            tasks = tasks.filter(function (taskItem) {
                return taskItem.id !== item.id;
            });

            saveToLocalStorage();
            renderTasks();
        });

        task.append(checkbox, span, del);
        list.append(task);
    });
}

function showError(msg) {
    error.textContent = `* ${msg}`;
    input.style.border = "2px solid #ff3860";
}

function removeError() {
    error.textContent = "";
    input.style.border = "2px solid #09c372";
}
