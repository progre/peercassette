// PeerCasette
// Copyright (C) 2015 progre (djyayutto@gmail.com)

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
/// <reference path="./typings.d.ts" />
//require('source-map-support').install();
require('crash-reporter').start();
import * as app from 'app';
import * as BrowserWindow from 'browser-window';
// import {getLogger} from 'log4js';
// const logger = getLogger();

let mainWindow: GitHubElectron.BrowserWindow = null;

new Promise((resolve, reject) => app.on('ready', resolve))
    .then(() => {
        mainWindow = new BrowserWindow({ width: 800, height: 600 });
        mainWindow.loadUrl(`file://${__dirname}/public/index.html`);
    })
    .catch(err => {
        // logger.fatal(err.stack);
    });
