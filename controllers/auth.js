const { isGuest, isUser } = require("../middleware/guards");
const router = require('express').Router();
const {
    register,
    login
} = require('../services/user');
const mapErrors = require('../util/mapErrors');



router.get('/register', isGuest(), (req,res) => {
    res.render('register', {title: "Register Page"})
})

router.post('/register', isGuest(), async (req, res) => {
    try {
        console.log(req.body)
        const trimmedPass = req.body.password.trim()
        if(trimmedPass.length < 3){
            throw new Error('Password must be at least 3 characters long')
        }
        else if (req.body.password != req.body.repass) {
            throw new Error('Passwords do not match');
        }
        const user = await register(req.body.email, req.body.username, req.body.password);
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        console.error(err)
        const errors = mapErrors(err)
        const data = {
            username: req.body.username,
            email: req.body.email
        }
        res.render('register', {title: 'Register Page', data, errors});
    }
})

router.get('/login', isGuest(), (req,res) => {
    res.render('login', {title: 'Login Page'})
})

router.post('/login', isGuest(), async (req,res) => {
    try{
          const user = await login(req.body.email, req.body.password);
          req.session.user = user;
          res.redirect('/');
    }catch(err){
       console.error(err)
       const errors = mapErrors(err)
       res.render('login', {data: { email: req.body.email }, errors});
    }
})

router.get('/logout', isUser(), (req,res) => {
    delete req.session.user;
    res.redirect('/')
})

module.exports = router;