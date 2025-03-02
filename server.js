const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
//const todoRoutes = require('./routes/todos') // Commenting out since we're using cards
const cardRoutes = require('./routes/cards')
const methodOverride = require('method-override')

require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

connectDB();
app.locals.stripTags = (input) => {
  return input.replace(/<(?:.|\n)*?>/gm, '')
}
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))
app.use(methodOverride('_method'))
// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
    })
  )
  
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// Routes
app.use('/', mainRoutes)
//app.use('/todos', todoRoutes) // Commenting out since we're using cards
app.use('/cards', cardRoutes) // added card routes
 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server is running on port: ${process.env.PORT}; you better catch it!`)
})    