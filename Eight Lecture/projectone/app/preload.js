const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("grok", {
  chat: async (message) => {
    return await ipcRenderer.invoke("grok-chat", message);
  },
});
