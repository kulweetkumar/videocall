const express = require('express');
const router = express.Router();

const helper = require('../config/helpers')

module.exports = (app) => {
    
    app.post('/sendNotification', async (req, res)=>{
        console.log('---req.body',req.body)
        var deviceType = req.body.device_type;
        var deviceToken = req.body.device_token;
        var data = req.body;
        delete data.device_token;
        delete data.device_type;
        var sendNotification = await helper.sendNotification(deviceToken,data,deviceType)
        res.json({
            data : req.body
        })
    });

    // return router;
}