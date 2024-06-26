require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const courseRoutes = require('./routes/courses')
const assignmentRoutes = require('./routes/assignments')
const schedulerRoutes = require('./routes/scheduler')
const flashcardRoutes = require('./routes/flashcards')
const flashcardSetsRoutes = require('./routes/flashcardsets')
const path = require("path");

// express app
const app = express()

// middleware
app.use(express.json())

// CORS
app.use(function(req, res, next){
    console.log(req.path, req.method)
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods',
    'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers',
        'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === "OPTIONS") res.sendStatus(200);
    else next();
});

// Register API routes
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

// routes
app.use('/api/courses', courseRoutes)
app.use('/api/user', userRoutes)
app.use('/api/assignments', assignmentRoutes)
app.use('/api/scheduler', schedulerRoutes)
app.use('/api/flashcards/cards', flashcardRoutes)
app.use('/api/flashcards/sets', flashcardSetsRoutes)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) =>
      res.sendFile(
        path.resolve(__dirname, '../frontend/build', 'index.html')
      )
    );
  }

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
        console.log('connected to db and listening on port', process.env.PORT)
        })
    })   
    .catch ((error) => {
        console.log(error)
    })
