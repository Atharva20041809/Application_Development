import { app, BrowserWindow, ipcMain } from "electron";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
function createWindow() {
  let window = new BrowserWindow({
    width: "1000px",
    height: "1000px",
    webPreferences: {
      preload:
        "/Users/atharvatiwari/Desktop/myfiles/Tenth Lecture/groq-ipc/preload.js",
    },
  });

  window.loadURL("http://localhost:5173/");
}

app.whenReady().then(() => {
  createWindow();
});

const client = new Groq({
  apiKey: process.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function askGroq(message) {
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: "user", content: message }],
    model: "openai/gpt-oss-20b",
  });
  return chatCompletion.choices[0].message;
}

ipcMain.handle("askGroq", async (event, message) => {
  return await askGroq(message);
});

ipcMain.handle("saveChat", (event, message) => {
  fs.writeFileSync("PreviousChat.txt", JSON.stringify(message));
});

ipcMain.handle("getChat", () => {
  return fs.readFileSync("PreviousChat.txt", "utf-8");
});
