document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("texts", ({ texts }) => {
    if (texts && texts.length > 0) {
      const textsList = document.getElementById("texts");
      texts.forEach((text, index) => {
        const li = document.createElement("li");
        li.textContent = text;
        const input = document.createElement("input");
        input.type = "text";
        input.value = text;
        //   input.style.width = "70%";
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
          editText(index, input);
        });
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
          deleteText(index);
        });
        li.appendChild(input);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        textsList.appendChild(li);
      });
    }
    const addTextButton = document.getElementById("addText");
    addTextButton.addEventListener("click", () => {
      addText();
    });
  });
});

function addText() {
  const newText = document.getElementById("newText").value;
  chrome.storage.local.get("texts", ({ texts }) => {
    if (texts) {
      texts.push(newText);
      chrome.storage.local.set({ texts });
    } else {
      chrome.storage.local.set({ texts: [newText] });
    }
    window.location.reload();
  });
}

function editText(index, input) {
  const newText = input.value;
  chrome.storage.local.get("texts", ({ texts }) => {
    texts[index] = newText;
    chrome.storage.local.set({ texts });
    window.location.reload();
  });
}

function deleteText(index) {
  chrome.storage.local.get("texts", ({ texts }) => {
    texts.splice(index, 1);
    chrome.storage.local.set({ texts });
    window.location.reload();
  });
}

const timeOption = document.getElementById("time-option");
timeOption.addEventListener("change", (event) => {
  const val = event.target.value;
  console.log(val);
  if (val < 1 || val > 60) {
    timeOption.value = 25;
  }
});

const saveBtn = document.getElementById("save-btn");
saveBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    timer: 0,
    timeOption: timeOption.value,
    isRunning: false,
  });
});

chrome.storage.local.get(["timeOption"], (res) => {
  timeOption.value = res.timeOption;
});
