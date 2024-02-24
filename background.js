chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveText",
    title: "Save Text",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveText") {
    const text = info.selectionText;
    chrome.storage.local.get("texts", ({ texts }) => {
      if (texts) {
        texts.push(text);
        chrome.storage.local.set({ texts });
      } else {
        chrome.storage.local.set({ texts: [text] });
      }
    });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: "popup.html" });
});

chrome.alarms.create("pomoTimer", {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name == "pomoTimer") {
    chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
      if (res.isRunning) {
        let timer = res.timer + 1;
        // console.log(timer);
        let isRunning = true;
        if (timer === 60 * res.timeOption) {
          this.registration.showNotification("Pomo Timer", {
            body: `${res.timeOption} minutes has passed!`,
            icon: "icon.png",
          });
          timer = 0;
          isRunning = false;
        }
        chrome.storage.local.set({
          timer: timer,
          isRunning: isRunning,
        });
      }
    });
  }
});

chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
  chrome.storage.local.set({
    timer: "timer" in res ? res.timer : 0,
    timeOption: "timeOption" in res ? res.timeOption : 25,
    isRunning: "isRunning" in res ? res.isRunning : false,
  });
});
