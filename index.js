const path = require('path')
const express = require('express')
const request = require('request')
require('dotenv').config()

const app = express() //whole library comes as function and we are loading to app variable
const {MAPS_API_KEY} = process.env
const port = 5001
const publicPath = path.join(__dirname, './public')

const url = 'https://maps.googleapis.com/maps/api/js?key='+ MAPS_API_KEY + '&callback=initializeMap'
app.use(express.static(publicPath))

app.get('/get-map-script', (req, resp) => {
    
    request({url: url}, (error, apiResponse) => {
        if (error) 
            return console.log('error to process request', error)
        
        resp.contentType('text/javascript')
        resp.send(apiResponse.body)
    })
})

app.listen(port, () => {
    console.log('server running on port', port)
})

