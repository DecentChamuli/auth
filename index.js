const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

mongoose.connect(process.env.MONGO_DB_URI, () => { console.log("Conected to DB") })
// mongoose.connect('mongodb://localhost:27017/', () => { console.log("Conected to DB") })

app.use(express.json())

app.use('/api/user/', require('./routes/auth'))
app.use('/api/create/', require('./routes/createClass'))

app.listen(PORT, ()=> {
    if(process.env.NODE_ENV !== 'production')
        console.log(`Server running on http://localhost:${PORT}`)
})