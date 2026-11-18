const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");
const http = require("node:http");
const crypto = require("node:crypto");

let server;
let serverPort;
const roms = new Map();

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

async function startLocalServer() {
  const base = path.join(__dirname, "src");
  server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://127.0.0.1");
      if (url.pathname.startsWith("/rom/")) {
        const id = url.pathname.slice(5);
        const rom = roms.get(id);
        if (!rom) { res.writeHead(404); res.end("ROM not found"); return; }
        res.writeHead(200, {
          "Content-Type": "application/octet-stream",
          "Content-Length": rom.data.length,
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store"
        });
        res.end(rom.data);
        return;
      }
      const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
      const filePath = path.resolve(base, "." + requested);
      if (!filePath.startsWith(base + path.sep) && filePath !== path.join(base, "index.html")) {
        res.writeHead(403); res.end("Forbidden"); return;
      }
      const data = await fs.readFile(filePath);
      res.writeHead(200, {
        "Content-Type": mime[path.extname(filePath)] || "application/octet-stream",
        "Access-Control-Allow-Origin": "*"
      });
      res.end(data);
    } catch {
      res.writeHead(404); res.end("Not found");
    }
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  serverPort = server.address().port;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 920, minWidth: 1100, minHeight: 720,
    backgroundColor: "#090d18",
    title: "GBA Reality Emulator",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadURL(`http://127.0.0.1:${serverPort}/`);
}

ipcMain.handle("rom:choose", async () => {
  const result = await dialog.showOpenDialog({
    title: "Seleccionar ROM de Game Boy Advance",
    properties: ["openFile"],
    filters: [{ name: "ROM de Game Boy Advance", extensions: ["gba"] }]
  });
  if (result.canceled || !result.filePaths[0]) return null;
  const filePath = result.filePaths[0];
  const data = await fs.readFile(filePath);
  const id = crypto.randomUUID();
  roms.set(id, { data, name: path.basename(filePath) });
  return { name: path.basename(filePath), url: `http://127.0.0.1:${serverPort}/rom/${id}` };
});

ipcMain.handle("file:save-stl", async (_event, payload) => {
  const result = await dialog.showSaveDialog({
    title: "Exportar objeto para impresión 3D",
    defaultPath: `${payload.filename || "objeto-gba"}.stl`,
    filters: [{ name: "Modelo STL", extensions: ["stl"] }]
  });
  if (result.canceled || !result.filePath) return { canceled: true };
  await fs.writeFile(result.filePath, payload.content, "utf8");
  return { canceled: false, filePath: result.filePath };
});

app.whenReady().then(async () => {
  await startLocalServer();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("before-quit", () => { if (server) server.close(); });
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
