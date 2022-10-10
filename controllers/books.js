const router = require('express').Router();
const {
    isUser
} = require('../middleware/guards');

const { mapErrors } = require('../util/mapErrors')
const Book = require('../models/Book')
const {
    createBook, getBookById, deleteBook, updateBook, addToWishlist
} = require('../services/books')

router.get('/create', isUser(), (req, res) => {
    res.render('create', {
        title: 'Create Book'
    });
})

router.post('/create', isUser(), async (req, res) => {
     
    const userId = req.session.user._id;
    const book = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        stars: req.body.stars,
        imageUrl: req.body.imageUrl,
        review: req.body.review,
        owner: userId

    }
    try {
    
        await createBook(book);
        res.redirect('/catalog');
    } catch (err) {
        console.error(err)
        const errors = [{msg: 'Try again'}];
        res.render('create', {
            title: 'Create book',
            errors,
            book
        })
    }

});

router.get('/edit/:id', isUser(), async (req, res) => {
    const id = req.params.id;
    console.log(req.params)
    const book =  await getBookById(id)
        if( req.session.user._id != book.owner._id){
           return res.redirect('/login') 
         }
         res.render('edit', {title: 'Edit Book', book})
})


router.post('/edit/:id', isUser(), async (req, res) => {
    const id = req.params.id;
    const book = {
        title: req.body.title,
        author: req.body.author,
        imageUrl: req.body.imageUrl,
        genre: req.body.genre,
        review: req.body.review,
        stars: req.body.stars
             }

    try{
    

        await updateBook(id, book)
         res.redirect('/catalog')
    }catch(err){
        const errors = [{msg: 'Try again'}];
        book._id = id;
        res.render('edit', {title: 'Edit Post', book, errors})
    }
})



router.get('/delete/:id', isUser(), async (req,res) => {
    const id = req.params.id;
    const book = await getBookById(id);
    if( req.session.user._id != book.owner._id){
       return res.redirect('/login') 
     }
     try{
        await deleteBook(id)
        res.redirect('/catalog')
    }catch(err){
        console.error(err);
        const errors = mapErrors(err);
        res.render('catalog', {errors})
    }

})

router.get('/wishlist/:id', isUser(), async (req,res) => {
console.log(req.session.user._id)
    try{
        await addToWishlist(req.params.id, req.session.user._id)
        res.redirect('/details/' + req.params.id)
    }catch(err){
        console.error(err);
        const errors = mapErrors(err);
        res.render('catalog', {errors})
    }
})

module.exports = router