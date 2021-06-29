const { app, BrowserWindow, Notification } = require('electron')



let mainAblak, betoltoKepernyo
app.on('ready', () => {
    mainAblak = new BrowserWindow({
        width: 850,
        height: 500,
        show: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })
    mainAblak.setIcon('app/src/img/ikon.ico')
    mainAblak.loadFile('app/index.html')
    mainAblak.removeMenu(true)

    betoltoKepernyo = new BrowserWindow({
        width: 450,
        height: 410,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    betoltoKepernyo.setIcon('app/src/img/ikon.ico')
    betoltoKepernyo.loadFile('app/loadingscreen.html')
    betoltoKepernyo.removeMenu(true)

    setTimeout(function() {
        betoltoKepernyo.close()
        mainAblak.show()
    }, 3500)
    app.setAppUserModelId('YouTube Konverter')
});