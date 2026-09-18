const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    // Create desktop window
    width: 800,
    height: 600,
  });

  win.loadFile("index.html"); // Display this HTML file
}

// When Electron finishes starting,
// create the window
app.whenReady().then(createWindow);
