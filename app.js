require('dotenv').config
require('express-async-errors');

const express = require('express')
const app = express

//middleware
app.use(express.json())


const port = process.env.PORT || 3000

const start = async () => {
    try {
        app.listen(port, () => 
            console.log(`Server is listening to ${port}....`)
        )
    } catch (error) {
        console.log(error)
    }
}

start()