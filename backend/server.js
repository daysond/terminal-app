
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// ------ Routes Import------
const challengeRoutes = require('./routes/challengeRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()

// ------ Global middleware ------
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use( (req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Routes
app.use('/api/challenge' ,challengeRoutes)
app.use('/api/user', userRoutes)


// Database
mongoose.connect(process.env.MONGO_URI)
    .then(()=> {
        app.listen(process.env.PORT, ()=> {
            console.log(`Connected to db & listening on port ${process.env.PORT}...`)
        })
    })
    .catch(error => console.log(error))



// Endpoints
// app.get('/', (req, res) => {

//     res.json({
//         msg:'welcome'
//     })
// })


