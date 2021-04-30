const express = require('express')
const router = express.Router()
const passport = require('passport')
const { isLoggedIn , isNotLoggedIn} = require('../lib/auth')


router.get('/signup', isNotLoggedIn, (request,response) =>{
      response.render('auth/signup')
}


)
router.post('/signup' , isNotLoggedIn, passport.authenticate('local.signup', {
      successRedirect: '/profile',
      failureRedirect: '/signup',
      failureFlash: true 
}))

router.get('/signin',isNotLoggedIn, (request,response) =>{
  response.render('auth/signin')
})

router.post('/signin' , isNotLoggedIn,(request,response, next) => {

  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true  
  })(request,response,next)

})


router.get('/profile' , isLoggedIn, (request, response) => {
  response.render('profile')
})


router.get('/logout', isLoggedIn,(request,response) => {
  request.logOut()
  response.redirect('/signin')
})


module.exports = router