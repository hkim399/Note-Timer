let notes = [];

function updateTime() {
  chrome.storage.local.get(["timer", "timeOption"], (res) => {
    const time = document.getElementById("time");
    const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(
      2,
      "0"
    );
    let seconds = "00";
    if (res.timer % 60 != 0) {
      seconds = `${60 - (res.timer % 60)}`.padStart(2, "0");
    }
    time.textContent = `${minutes}:${seconds}`;
  });
}
updateTime();
setInterval(updateTime, 1000);

const startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    chrome.storage.local.set(
      {
        isRunning: !res.isRunning,
      },
      () => {
        startBtn.textContent = !res.isRunning ? "Pause" : "Start";
      }
    );
  });
});

const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", () => {
  chrome.storage.local.set(
    {
      timer: 0,
      isRunning: false,
    },
    () => {
      startBtn.textContent = "Start";
    }
  );
});

const addNoteBtn = document.getElementById("add-note-btn");
addNoteBtn.addEventListener("click", () => addNote());

chrome.storage.sync.get(["notes"], (res) => {
  notes = res.notes ? res.notes : [];
  renderNotes();
});

function saveNotes() {
  chrome.storage.sync.set({
    notes: notes,
  });
}

function renderNote(noteIndex) {
  const noteRow = document.createElement("div");

  const note = document.createElement("input");
  note.type = "text";
  note.placeholder = "Enter a Note...";
  note.value = notes[noteIndex];
  note.addEventListener("change", () => {
    notes[noteIndex] = note.value;
    saveNotes();
  });

  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "X";
  deleteBtn.addEventListener("click", () => {
    deleteNote(noteIndex);
  });

  noteRow.prepend(deleteBtn);
  noteRow.prepend(note);

  const noteContainer = document.getElementById("note-container");
  noteContainer.prepend(noteRow);
}

function addNote() {
  const noteIndex = notes.length;
  notes.push("");
  renderNote(noteIndex);
  saveNotes();
}

function deleteNote(noteIndex) {
  notes.splice(noteIndex, 1);
  renderNotes();
  saveNotes();
}

function renderNotes() {
  const noteContainer = document.getElementById("note-container");
  noteContainer.textContent = "";
  notes.forEach((note, noteIndex) => {
    renderNote(noteIndex);
  });
}
