const path = require('path');
const express = require('express')
const configViewEngine = (app) => {
    //config template engine

    app.set('views', './src/views/');
    //config public files
    app.set('view engine', 'ejs');
    app.use(express.static('./src/public'))
}

module.exports = configViewEngine;