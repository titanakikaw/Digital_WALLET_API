const express = require('express');
const UserRoutes= express.Router();


UserRoutes.get('/', (req,res) => {
    res.send('testing route')
})

module.exports = UserRoutes