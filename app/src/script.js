const { dialog, Notification } = require('electron').remote
const fs = require("fs")
const yt_download = require("ytdl-core")
const path_name = require('path')
var eleresi_ut



const letoltes_gomb = document.querySelector('#konvertalas')
const link_doboz = document.querySelector('#link')
const formatum_doboz = document.querySelector('#formatum')
letoltes_gomb.addEventListener('click', () => {
    let beirturl = link_doboz.value
    if (beirturl.length > 16) {
        if (eleresi_ut != undefined) {
            letoltes(beirturl, formatum_doboz.value)
            link_doboz.value = ''
            link_kijelzo.innerHTML = 'Videó linkje: <span id="nincsmegadva">Nincs megadva</span>'
        } else { hiba(1) }
    } else { hiba(0) }
});


let ertesites
    //elso.scrollIntoView({ behavior: "smooth" })

const folyamat = document.getElementById('folyamat')
const eredmeny = document.getElementById('lent')


async function letoltes(link, formatum) {
    letoltes_gomb.style.display = 'none'
    folyamat.style.display = 'block'
    var id = await yt_download.getVideoID(link);
    console.log(id)
    var info = await yt_download.getInfo(id);
    console.log(info)
    if (formatum == ".mp3") {
        let output = path_name.resolve(eleresi_ut, `${info.videoDetails.title}${formatum}`);
        await yt_download(link, { quality: 'highestaudio' })
            .on("progress", (chunklength, downloaded, total) => {
                let letoltes_merete = downloaded / total
                console.log(letoltes_merete)
                folyamat.value = letoltes_merete
                if (letoltes_merete == 1) {
                    ertesites = new Notification({
                        title: 'Letöltés sikeres!',
                        body: info.videoDetails.title,
                    }).show()
                    eredmenyBeallitas(info, eleresi_ut)
                }
            })
            .pipe(fs.createWriteStream(output));
    } else {
        let output = path_name.resolve(eleresi_ut, `${info.videoDetails.title}${formatum}`);
        await yt_download(link)
            .on("progress", (chunklength, downloaded, total) => {
                let letoltes_merete = downloaded / total
                console.log(letoltes_merete)
                folyamat.value = letoltes_merete
                if (letoltes_merete == 1) {
                    ertesites = new Notification({
                        title: 'Letöltés sikeres!',
                        body: info.videoDetails.title,
                    }).show()
                    eredmenyBeallitas(info, eleresi_ut)
                }
            })
            .pipe(fs.createWriteStream(output));
    }
}

const videoneve_kijelzo = document.getElementById('videoneve_kijelzo')
const feltolto_kijelzo = document.getElementById('feltolto_kijelzo')
const feltoltve_kijelzo = document.getElementById('feltoltve_kijelzo')
const megtekintesek_kijelzo = document.getElementById('megtekintesek_kijelzo')
const hossza_kijelzo = document.getElementById('hossza_kijelzo')
const indexkep_kijelzo = document.getElementById('indexkep_kijelzo')

const fent = document.getElementById('fent')
const mappamegnyitasa_gomb = document.getElementById('mappamegnyitasa')

function eredmenyBeallitas(kapottadat, ut) {
    letoltes_gomb.style.display = 'block'
    folyamat.style.display = 'none'
    eredmeny.style.display = 'block'
    eredmeny.scrollIntoView({ behavior: "smooth" })
    console.log(kapottadat)
    videoneve_kijelzo.innerHTML = `Videó neve:  <strong>${kapottadat.videoDetails.title}</strong>`
    feltolto_kijelzo.innerHTML = `Feltöltő: <strong>${kapottadat.videoDetails.ownerChannelName}</strong>`
    feltoltve_kijelzo.innerHTML = `Feltöltve ekkor: <strong>${kapottadat.videoDetails.uploadDate}</strong>`
    megtekintesek_kijelzo.innerHTML = `Megtekintések száma: <strong>${kapottadat.videoDetails.viewCount}</strong>`
    let totalSeconds = kapottadat.videoDetails.lengthSeconds
    let hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    let minutes = Math.floor(totalSeconds / 60)
    let seconds = totalSeconds % 60
    hossza_kijelzo.innerHTML = `Videó hossza: <strong>${hours} óra ${minutes} perc ${seconds} másodperc</strong>`
    indexkep_kijelzo.src = kapottadat.videoDetails.thumbnail.thumbnails[3].url
    mappamegnyitasa_gomb.addEventListener('click', () => {
        mappamegnyitas(ut)
    });

}

function mappamegnyitas(ut) {
    require('child_process').exec(`start "" "${ut}"`);
}


const hely_valasztas_gomb = document.querySelector('#hely_valasztas')
const hely_kiiras = document.querySelector('#hely_kijelzo')
hely_valasztas_gomb.addEventListener('click', () => {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(ertek => {
        if (ertek.filePaths[0] != undefined) {
            hely_kiiras.innerHTML = `Letöltés ide: <strong>${ertek.filePaths[0]}</strong>`
            eleresi_ut = ertek.filePaths[0];
        }
    })
});
const formatum_kijelzo = document.querySelector('#formatum_kijelzo')
formatum_doboz.addEventListener('change', () => {
    if (formatum_doboz.value == 'semmi') { formatum_kijelzo.innerHTML = `Formátum: <span id="nincsmegadva">Nincs megadva</span>` }
    if (formatum_doboz.value == '.mp3') { formatum_kijelzo.innerHTML = `Formátum: <strong>MP3 (Hang)</strong>` }
    if (formatum_doboz.value == '.mp4') { formatum_kijelzo.innerHTML = `Formátum: <strong>MP4 (Videó)</strong>` }
});

const link_kijelzo = document.querySelector('#videolink_kijelzo')
link_doboz.addEventListener('change', () => {
    if (link_doboz.value.includes('https://')) {
        if (link_doboz.value.includes('youtube') || link_doboz.value.includes('youtu.be')) {
            link_kijelzo.innerHTML = `Videó linkje: <strong style="font-size: 13px;">${link_doboz.value}</strong>`
        } else { hiba(0) }
    } else { hiba(0) }
});

function hiba(hibakod) {
    if (hibakod == 0) {
        alert('Kérlek egy videó linkjét írd be!');
        link_doboz.value = ''
    }
    if (hibakod == 1) { alert('Kérlek válassz letöltési helyet!') }
}