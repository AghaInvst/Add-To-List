import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://playground-e111e-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const tasksListInDB = ref(database, "tasksList");
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const tasksListEl = document.getElementById("tasks-list");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  if (inputValue.trim() !== "") {
    push(tasksListInDB, inputValue);
    clearInputFieldEl();
  }
});

onValue(tasksListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    clearTasksListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];
      appendItemToTasksListEl(currentItemID, currentItemValue);
    }
  } else {
    tasksListEl.innerHTML = "<li>No tasks added... yet</li>";
  }
});

function clearTasksListEl() {
  tasksListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemToTasksListEl(itemID, itemValue) {
  let newEl = document.createElement("li");
  newEl.textContent = itemValue;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `tasksList/${itemID}`);
    remove(exactLocationOfItemInDB);
  });

  tasksListEl.append(newEl);
}
