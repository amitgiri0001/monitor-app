'use strict'
const packager = require('electron-packager')

const options = {
    dir: './',
    arch: 'x64',
    platform: 'darwin',
    out: '../'
};

(async _ =>  await packager(options))();