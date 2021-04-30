const { response } = require('express')
const express = require('express')
const router = express.Router()

const pool = require('../database')
const { isLoggedIn} = require('../lib/auth')

router.get('/add' , isLoggedIn, (request,response) => {
  response.render('links/add')
})



router.post('/add' , isLoggedIn, async (request,response) =>{
  const {title,url,description} = request.body
  const newLink = {
    title,
    url,
    description,
    user_id: request.user.id
  }
  await pool.query('INSERT INTO links set ?', [newLink])
  request.flash('success' , 'Link Guardado exitosamente')
  console.log(newLink)
  
  response.redirect('/links')
})

router.get('/', isLoggedIn, async (request,response) => {
  const links = await pool.query('SELECT * FROM links WHERE user_id = ?' , [request.user.id])
  console.log(links)
  response.render('links/list',{links})
})

router.get('/delete/:id',isLoggedIn, async (request,response) =>{
  const {id} = request.params
  await pool.query('DELETE FROM links WHERE ID = ?', [id])
  request.flash('success', 'Link eliminado correctamente')
  response.redirect('/links')
})

router.get('/edit/:id' ,isLoggedIn, async (request,response) =>{
  const {id} =request.params
  const links = await pool.query('SELECT * FROM links WHERE id = ?' , [id])
  response.render('links/edit' , {link: links[0]})
})

router.post('/edit/:id' , isLoggedIn, async (request,response) => {
    const { id } =request.params
    const { title, description,url} = request.body
    const newLink = {
      title,
      description,
      url 
    }

    await pool.query('UPDATE links set ? WHERE id = ?' , [newLink, id])
    request.flash('success' , 'Link actualizado correctamente')
    response.redirect('/links')
})

module.exports = router