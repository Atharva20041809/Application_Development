import {app, BrowserWindow} from 'electron';

function createWindow(){
    let window = new BrowserWindow({
        'width':'800px','height' :'800px'
    })

    window.loadURL("http://localhost:5173/");
}

app.whenReady().then(createWindow);