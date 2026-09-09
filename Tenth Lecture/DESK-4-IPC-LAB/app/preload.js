let { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("music", {
  start: () => {
    ipcRenderer.invoke("start");
  },
  pause: () => {
    ipcRenderer.invoke("pause");
  },
});
