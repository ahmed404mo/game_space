const { app, BrowserWindow } = require('electron');
const path = require('path');

// ** تصحيح استدعاء المكتبة **
const serveLib = require('electron-serve');
const serve = serveLib.default || serveLib;

const isDev = !app.isPackaged;

// إعداد تحميل المجلد 'out' كأنه تطبيق محلي
const loadURL = serve({ directory: 'out' });

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    // في وضع التطوير: يجب أن يكون npm run dev يعمل في الخلفية
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    // في وضع الإنتاج (EXE):
    // سيقوم بتحميل ملفات out بشكل صحيح وتلقائي
    loadURL(win);
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});