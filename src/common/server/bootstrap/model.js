/**
 * 数据层入口
 * Created by jess on 16/6/4.
 */


'use strict';


const mongoose = require('mongoose');


const conf = grape.configManager.getConfig('mongodb');


mongoose.connect( conf.uri );

