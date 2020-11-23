var express = require('express');
var router = express.Router();
const mongoose=require('mongoose');

const Contacts=require('../models/Contacts');
const Userinfo=require('../models/Userinfo');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/addcontact', function(req, res, next) {
  res.render('contacts/addcontact', { title: 'Add Contact' });
});

/*router.get('/savedummy',function(req,res){
  const newUserinfo=new Userinfo({
    username:'akshaydesai26',
    marketing:[],
    finance:[],
    hr:[],
    sports:[]

  });
  newUserinfo.save()
    .then(
      console.log('saved')
      )
    .catch(err=>console.log(err));
});*/
router.post('/savecontact', function(req, res, next) {
  
  var data=req.body;
  const{name,email,description,tags}=req.body;
  console.log(data);
  var tag_arr=tags.split(',');
  console.log(tag_arr);
  const newCont = {
    name: name,
    email: email,
    description: description,
    tag_arr: tag_arr
  };
  var username='akshaydesai26';

  Contacts.create(newCont,(err,just_saved)=>{
    if(err){
      res.status(500).send(err);
    }
    function uploader(i) {
      while( i < tag_arr.length ) {
        var update={};
        var tmp=tag_arr[i];
        console.log(tmp);
        update[tmp]=just_saved._id;
        console.log(update);
        Userinfo.update({username:username},{$push: update},(err,updated_tag)=>{
            if(err){
              res.status(500).send(err);
            }
            //console.log(updated_tag);
            //uploader(i+1);
        })
        i=i+1;
        console.log(i);
        if(i==tag_arr.length)
        {
          console.log('rendering now');
          res.render('index', { title: 'New contact saved' });
        }
      }
    }
    uploader(0);
    console.log('just_saved');
    
  })
  
});

router.get('/contacts',function(req,res){
  //res.render('admin');
  Contacts.find({}, (err, userjson) => {
      if (err) {
        res.status(500).send(err);
      }
      console.log(userjson);
      res.render('contacts/contacts', {data: userjson});
      //console.log(data);
    });

});

router.get('/profile',function(req,res){
  console.log(req.query);
  console.log(req.params);
  console.log(req.body);
  res.send('HREF');
})
router.post('/profile',function(req,res){
  //res.render('admin');
  var id=req.body.id;
  console.log(id);
  //var id = mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
  Contacts.find({_id:id}, (err, userjson) => {
    if (err) {
      res.status(500).send(err);
    }
    console.log(userjson);
    res.render('contacts/profile', {data: userjson});
    //console.log(data);
  });
  //res.render('profile',{id: id});

});

router.get('/home',function(req,res){
  username='akshaydesai26';
  Userinfo.find({username:username},(err,info)=>{
    //console.log(info);
    var market_no=info[0].marketing.length;
    var market_arr=info[0].marketing;
    var finance_no=info[0].finance.length;
    var finance_arr=info[0].finance;
    var hr_no=info[0].hr.length;
    var hr_arr=info[0].hr;
    //console.log(market_no);
    res.render('contacts/home', { market_no:market_no, finance_no:finance_no, hr_no:hr_no, market_arr:market_arr, finance_arr:finance_arr, hr_arr:hr_arr });

  })
})

module.exports = router;
