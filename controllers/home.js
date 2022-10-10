const router = require('express').Router();
const userSession = require('../middleware/userSession');
const {
    mapErrors
} = require('../util/mapErrors');
const {getBooks, getBookById} = require('../services/books')
const mongoose = require('mongoose');


router.get('/', userSession(), (req, res) => {
    res.render('home', {title:'Home page'})
})

router.get('/catalog', async (req,res) => {
    const books = await getBooks()
    res.render('catalog', {title: 'Catalog page', books})
})

router.get('/details/:id', userSession(), async (req,res) =>{
    try{
        const id = req.params.id;
        const book = await getBookById(id);   
        book.hasNotWished = true
        if(req.session.user){
            book.hasUser = true;
            if( req.session.user._id == book.owner._id){
                book.isOwner = true;
            }
             if(book.wishingList.includes(req.session.user._id)){
                 book.hasWished = true
                 book.hasNotWished = false
             }
        }
      
        res.render('details', {title: 'Details Page', book})
    }catch(err){
            console.error(err);
    }
   
})


router.get('/profile', userSession(), (req,res) => {
    const user = req.session.user
    res.render('profile', {title: 'Profile Page', user})
})

module.exports = router