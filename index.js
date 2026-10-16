const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

function createWindow() {
  //Removing unwanted menu elements
  const menuTemplate = [{ role: "fileMenu" }, { role: "viewMenu" }];

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

  const win = new BrowserWindow({
    // Create desktop window
    width: 950,
    height: 875,
    icon: path.join(__dirname, "images", "app.ico"),
  });

  win.loadFile("index.html"); // Display this HTML file
}

// When Electron finishes starting,
// create the window
app.whenReady().then(createWindow);
