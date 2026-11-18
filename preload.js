const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("gbaDesktop", {
  chooseRom: () => ipcRenderer.invoke("rom:choose"),
  saveStl: (payload) => ipcRenderer.invoke("file:save-stl", payload)
});
