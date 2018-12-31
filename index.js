'use strict';

const { app, Tray, nativeImage, Menu } = require('electron');
const { currentLoad, mem, networkStats } = require('systeminformation');

const loading = `(~_~)`;
let tray;
let displayKit = {
    cpu: 0,
    memory: 0,
    network: 1
};

const displayLatestStats = ({ cpu = displayKit.cpu, memory = displayKit.memory, network = displayKit.network }) => {
    displayKit = { ...displayKit, cpu, memory, network };
    tray.setTitle(`[ ${cpu ? Math.ceil(cpu) : '--'} % | ${memory ? Math.floor(memory / Math.pow(10, 9)) : '--'} GB | ${network || '--'} ⇅ ]`);
}

const createTray = (image) => {
    const tray = new Tray(image || nativeImage.createEmpty());
    tray.setContextMenu(
        Menu.buildFromTemplate([{ label: 'Quit', role: 'quit' }])
    );
    
    return tray;
}

{
    let count = 5 + 1;
    setInterval(async _ => {
        const { rx_sec } = await networkStats();
        if (rx_sec && count > 5) {
            count = 0;
            displayLatestStats({ network: +(rx_sec / Math.pow(10, 3)).toFixed(1) });
        }
        count++;

    }, 1000)
}

const onReady = _ => {
    process.env.ENV_DEV || app.dock.hide();

    tray = createTray();
    tray.setTitle(loading);

    setInterval(async _ => {
        const [{ currentload: cl }, { used }] = await Promise.all([await currentLoad(), await mem()]);
        displayLatestStats({ cpu: cl, memory: used });

    }, 10000)

}

app.on('ready', onReady);