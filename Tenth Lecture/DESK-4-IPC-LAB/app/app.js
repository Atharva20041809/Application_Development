import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { spawn } from "child_process";
import { start } from "repl";

function createWindow() {
  const window = new BrowserWindow({
    height: 600,
    width: 600,
    webPreferences: {
      preload:
        "/Users/atharvatiwari/Desktop/myfiles/Tenth Lecture/DESK-4-IPC-LAB/app/preload.js",
    },
  });

  window.loadURL("http://localhost:5173");
  window.webContents.openDevTools();
}

app.whenReady().then(createWindow);

let musicProcess = null;

function startMusic() {
  const randomNumber = Math.floor(Math.random() * 3);
  const songs = ["first.mp3", "second.mp3", "third.mp3"];

  musicProcess = spawn("vlc", [
    "--intf",
    "rc",
    `./songs/${songs[randomNumber]}`,
  ]);
}

function pausePlayMusic() {
  if (!musicProcess) {
    console.log("no music is playing");
    return;
  }
  console.log('we are in the function of pausing ')
  musicProcess.stdin.write("pause\n");
}

ipcMain.handle("start", () => {
  startMusic();
});

ipcMain.handle("pause", () => {
  console.log('pause is touched')
  pausePlayMusic();
});
