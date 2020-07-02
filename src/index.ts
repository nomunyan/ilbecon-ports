import { app, BrowserWindow, Menu, ipcMain } from "electron";
import axios from "axios";
import FormData from "form-data";
import { ImgData } from "./Provider";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 150,
    width: 600,
    maximizable: false,
    resizable: false,
    show: false,
    useContentSize: true,
    autoHideMenuBar: true,
    webPreferences: { nodeIntegration: true },
  });

  ipcMain.on("resize", (_event, height) => {
    mainWindow.setContentSize(600, height, true);
    mainWindow.setMaximizable(false);
    mainWindow.setResizable(false);
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  const isMac = process.platform === "darwin";
  const template: Electron.MenuItemConstructorOptions[] = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideothers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          } as Electron.MenuItemConstructorOptions,
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: "File",
      submenu: [
        isMac ? { role: "close" } : { role: "quit" },
      ] as Electron.MenuItemConstructorOptions[],
    },
    // { role: 'editMenu' }
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? ([
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }],
              },
            ] as Electron.MenuItemConstructorOptions[])
          : ([
              { role: "delete" },
              { type: "separator" },
              { role: "selectAll" },
            ] as Electron.MenuItemConstructorOptions[])),
      ],
    },
    // { role: 'windowMenu' }
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(isMac
          ? ([
              { type: "separator" },
              { role: "front" },
              { type: "separator" },
              { role: "window" },
            ] as Electron.MenuItemConstructorOptions[])
          : ([{ role: "close" }] as Electron.MenuItemConstructorOptions[])),
      ],
    },
    {
      role: "help",
      submenu: [
        {
          label: "소스코드",
          click: async (): Promise<void> => {
            await require("electron").shell.openExternal(
              "https://github.com/nomunyan/ilbecon-ports"
            );
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  process.env.NODE_ENV === "development" &&
    mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("fetch", async (event, url: string) => {
  const { data } = await axios.get(url);
  event.returnValue = data;
});

export interface UploadResult {
  uploaded: number;
  error?: { message: string };
  url?: string;
  fileName?: string;
}

ipcMain.on("upload-from-url", async (event, imgData: ImgData) => {
  try {
    const formData = new FormData();
    const { data: imgStream, headers } = await axios.get<NodeJS.ReadableStream>(
      imgData.url,
      {
        responseType: "stream",
      }
    );
    const content: string = headers["content-disposition"];
    formData.append("upload", imgStream, {
      filename: content.match(/filename="(.*)"/i)[1] || imgData.filename,
    });
    formData.append("ckCsrfToken", "nomunyan");
    const { data } = await axios.post<UploadResult>(
      "https://www.ilbe.com/file/imageupload?d=518&m=523&responseType=json",
      formData,
      {
        headers: {
          Cookie: "ckCsrfToken=nomunyan;",
          ...formData.getHeaders(),
        },
      }
    );
    event.reply("upload-from-url-reply", data);
  } catch (e) {
    event.reply("upload-from-url-reply", {
      uploaded: 0,
      error: { message: e.message },
    } as UploadResult);
  }
});
