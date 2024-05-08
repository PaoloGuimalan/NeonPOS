import path from 'path'
import { app, ipcMain, screen } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { exec } from 'child_process'
import os from "os";
import fs from 'fs';

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const displays = screen.getAllDisplays();
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })

  const mainWindow = createWindow('main', {
    // kiosk: true,
    width: width,
    height: height,
    frame: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // const externalWindow = createWindow('external', {
  //   // kiosk: true,
  //   width: width,
  //   height: height,
  //   frame: false,
  //   // skipTaskbar: true,
  //   fullscreen: false,
  //   x: externalDisplay.bounds.x,
  //   y: externalDisplay.bounds.y,
  //   webPreferences: {
  //     preload: path.join(__dirname, 'preload.js'),
  //     nodeIntegration: true,
  //   },
  // })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
    // await externalWindow.loadURL('app://./external/external')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    // await externalWindow.loadURL(`http://localhost:${port}/external/external`)
    // mainWindow.webContents.openDevTools()
  }

  // Listen for user input
  ipcMain.on('execute-command', (event, command) => {
    executeCommand(command)
      .then(output => {
        mainWindow.webContents.send('command-output', output);
      })
      .catch(error => {
        mainWindow.webContents.send('command-error', error.message);
      });
  });

  ipcMain.on('get-directories', (event, command) => {
    try{
      if(command.trim() === ""){
        const defaultpath = os.platform() === "linux" ? "\\" : "C:\\";
        const result = fs.readdirSync(defaultpath, { withFileTypes: true });
        const directories = result.filter((flt) => flt.isDirectory()).map((mp) => `${defaultpath}\\${mp.name}`);
        const files = result.filter((flt) => !flt.isDirectory()).map((mp) => `${defaultpath}\\${mp.name}`);
        // console.log({ path: defaultpath, dirs: directories, files: files });
        mainWindow.webContents.send('get-directories-output', JSON.stringify({ path: defaultpath, dirs: directories, files: files }));
      }
      else{
        const result = fs.readdirSync(command, { withFileTypes: true });
        const directories = result.filter((flt) => flt.isDirectory()).map((mp) => `${command}\\${mp.name}`);
        const files = result.filter((flt) => !flt.isDirectory()).map((mp) => `${command}\\${mp.name}`);
        // console.log({ path: command, dirs: directories, files: files });
        mainWindow.webContents.send('get-directories-output', JSON.stringify({ path: command, dirs: directories, files: files }));
      }
    }
    catch(ex){
      mainWindow.webContents.send('get-directories-error', `Error Get Directories: ${ex.message}`);
    }
  });

  // Function to execute shell commands
  function executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
