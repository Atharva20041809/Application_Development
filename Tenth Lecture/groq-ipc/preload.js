let { contextBridge, ipcRenderer } = require("electron");
console.log("PRELOAD LOADED");
contextBridge.exposeInMainWorld("mygroq", {
  askGroq: (message) => {
    return ipcRenderer.invoke("askGroq", message);
  },
  getChat: () => {
    return ipcRenderer.invoke("getChat");
  },
  saveChat: (message) => {
    ipcRenderer.invoke("saveChat", message);
  },
});
