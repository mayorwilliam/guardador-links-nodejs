const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')
const passport = require('passport')

const {database} = require('./keys')

// initializations

const app = express()
require('./lib/passport')


// settings 
app.set('port' ,process.env.PORT || 4000)
app.set('views' , path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({ 
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'),'layouts'),
  partialsDir: path.join(app.get('views'),'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')

}))
app.set('view engine' , '.hbs')


//middlewares
app.use(session({
  secret: 'faztmysqlnodesession',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)

}))
app.use(flash())
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())


//variables globales
app.use((request,response,next) =>{
   app.locals.success = request.flash('success')
   app.locals.message = request.flash('message')
   app.locals.user = request.user
  next()
})


//Routes
app.use(require('./routes'))
app.use(require('./routes/authentification'))
app.use('/links', require('./routes/links'))



//Public
app.use(express.static(path.join(__dirname, 'public')))


//Empezar el servidor
app.listen(app.get('port') , () => {
   console.log('Servidor en el puerto ' ,app.get('port'))
})