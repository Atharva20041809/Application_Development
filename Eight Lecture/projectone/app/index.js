import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import dotenv from "dotenv";

// --------------------------------------------------
// __dirname for ES Modules
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------------------------
// Load .env from project root
// --------------------------------------------------

const envPath = path.resolve(__dirname, "../.env");

dotenv.config({
  path: envPath,
});

console.log("ENV PATH:", envPath);
console.log("API KEY LOADED:", !!process.env.GROQ_API_KEY);

if (!process.env.GROQ_API_KEY) {
  console.error("ERROR: GROQ_API_KEY was not found in .env");
}

// --------------------------------------------------
// Groq client
// --------------------------------------------------

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// --------------------------------------------------
// Handle messages from React
// --------------------------------------------------

ipcMain.handle("grok-chat", async (event, message) => {
  try {
    console.log("Message received:", message);

    const response = await groq.responses.create({
      model: "openai/gpt-oss-20b",
      input: message,
    });

    return {
      success: true,
      response: response.output_text,
    };
  } catch (error) {
    console.error("Groq API Error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
});

// --------------------------------------------------
// Create Electron window
// --------------------------------------------------

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL("http://localhost:5173");

  win.webContents.openDevTools();
}

// --------------------------------------------------
// Electron lifecycle
// --------------------------------------------------

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
