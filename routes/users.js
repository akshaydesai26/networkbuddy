//user login and register

const express= require('express');
const router= express. Router(); //1.get router function  from express
const bcrypt= require('bcryptjs'); //8
const passport = require('passport');


//5.user model
const User=require('../models/User');

//welcome
router.get('/welcome',(req,res)=>{
  res.render('auth/welcome');
})
//login page
router.get('/login',(req,res) => res.render('auth/login'));  //2.


//register page
router.get('/register',(req,res) => res.render('auth/register'));  //3.

router.post('/register', (req,res) => {   //4. when post request made
    /*console.log(req.body) tests if body contains data of post
    res.send('hello'); outputs hello*/
    const{name, email, password,password2}=req.body;
    let errors= [];
    //check fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'fill all fiedls'});
    }
    //check match
    if(password!=password2){
        errors.push({msg: 'passwords dont match'});
    }

    if(errors.length>0){
        res.render('auth/register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        //7.if validation passes
        User.findOne({ email: email }).then(user => {  //it returns a user record, which can be used ahead
            if (user) {
              errors.push({ msg: 'Email already exists' });
              res.render('auth/register', {
                errors,
                name,
                email,
                password,
                password2
              }); //register page is loaded with access to given variables
            } else {
              const newUser = new User({
                name,
                email,
                password
              });

                    /*console.log(newUser)
                    res.send('hello');*/

                    //9.hash password
                    bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password=hash; //set password to hash

                        //save user
                        newUser.save()
                            .then(user=>{
                                req.flash('success_msg','u r registered and can login');
                                res.redirect('/users/login');  //render for same page with data, redirect for different
                            })
                            .catch(err=>console.log(err));
                    }))
                }
            })

    }
});


//10.login handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/users/welcome',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

//11.logout

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','you are logged out');
    res.redirect('/users/login');
})

module.exports = router;