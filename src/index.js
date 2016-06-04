/**
 * Created by jess on 16/6/3.
 */


'use strict';


const path = require('path');
const Entrance = require('grapejs');


let appPathRoot = __dirname;
let appStaticPath = path.dirname(appPathRoot) + '/static';
let appViewPath = path.dirname(appPathRoot) + '/views';
let appMapPath = path.dirname(appPathRoot) + '/resource-map';

let app = new Entrance({
    APP_PATH : appPathRoot,
    APP_URL_PREFIX : '/cms',
    APP_STATIC_URL_PREFIX : '/static',
    APP_STATIC_PATH : appStaticPath,
    APP_VIEW_PATH : appViewPath,
    APP_MAP_PATH : appMapPath
});



app.run();