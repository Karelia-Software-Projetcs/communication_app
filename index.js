const { app, BrowserWindow, Menu, dialog } = require("electron");
const path = require("path");

function createWindow() {
  //Removing unwanted menu elements
  const menuTemplate = [
    { role: "fileMenu" },
    { role: "viewMenu" },
    {
      label: "About",
      submenu: [
        {
          label: "Communication Aid",
          click: function () {
            dialog.showMessageBox({
              type: "info",
              title: "About Communication Aid - version 1.4.0",
              message: "Communication Aid",
              detail:
                "Communication Aid is a visual communication application designed to help students express basic needs such as water, food, toilet, tiredness, and anger. It supports English and Finnish, student profiles, illustrated tiles, and recorded voice prompts.",
            });
          },
        },
      ],
    },
  ];

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
