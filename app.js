const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('Hello Jenkins')
})

app.listen(5000)