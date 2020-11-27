var express = require('express');
var router = express.Router();
var csrf=require('csurf');
var passport=require('passport');
var csrfProtection= csrf();
router.use(csrfProtection);
const Userinfo=require('../models/Userinfo');
router.get('/profile',isLoggedIn,function(req, res, next){
    res.render('index',{title: req.user.name});
});
router.get('/logout',isLoggedIn,function(req, res, next){
  req.logout();
  res.redirect('/');
});

//only if not logged in, all the routes below will work
router.use('/',notLoggedIn, function(req, res, next){
  next();
});
router.get('/signup',function(req, res, next){
  var messages=req.flash('error');
  res.render('auth/register',{csrfToken: req.csrfToken(), messages:messages, hasErrors:messages.length>0});
});

router.post('/signup',passport.authenticate('local.signup',{
  failureRedirect:'/users/signup',
  failureFlash:true
}),function(req, res, next){

  const newUserinfo=new Userinfo({
    username:req.user.email,
    marketing:[],
    finance:[],
    hr:[],
    sports:[]
  });
  newUserinfo.save()
    .then(
      console.log('new DS saved')
      )
    .catch(err=>console.log(err));

  if(req.session.oldUrl){
    console.log('old');
    var oldUrl=req.session.oldUrl;
    req.session.oldUrl=null;
    res.redirect(oldUrl);
  }else{
    console.log('new');
    res.redirect('/home');
  }
});
router.get('/signin',function(req, res, next){
 var messages=req.flash('error');
 res.render('auth/login',{csrfToken: req.csrfToken(), messages:messages, hasErrors:messages.length>0});
});

router.post('/signin', passport.authenticate('local.signin',{
 failureRedirect:'/users/signin',
 failureFlash:true
}), function(req, res, next){
  if(req.session.oldUrl){
    var oldUrl=req.session.oldUrl;
    req.session.oldUrl=null;
    res.redirect(oldUrl);
  }else{
    res.redirect('/home');
  }
} );
module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/signin');
}
function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/profile');
}