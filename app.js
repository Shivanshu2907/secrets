//jshint esversion:6
require('dotenv').config()
const express=require('express')
const bp=require('body-parser')
const request=require('request')
const mongoose=require('mongoose')
const ejs=require('ejs')
const _=require('lodash')
var encrypt = require('mongoose-encryption');

const app=express()
app.use(bp.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')

mongoose.connect('mongodb://localhost:27017/secrets',{useNewUrlParser:true,useUnifiedTopology:true})

const schema=new mongoose.Schema({
    username:String,
    password:String
})

schema.plugin(encrypt, { secret:process.env.SECRET ,encryptedFields: ['password']});

const auth=mongoose.model('users',schema)

app.get('/',function(req,res){
    res.render('home')
})
app.get('/register',function(req,res){
    res.render('register')
})
app.get('/login',function(req,res){
    res.render('login')
})
app.post('/register',function(req,res){
    var nuser=new auth({
        username:req.body.username,
        password:req.body.password
   })
    nuser.save()
    res.redirect('/login')
})
app.post('/login',function(req,res){
    var permit=false
    var name=req.body.username
    var pass=req.body.password
    auth.findOne({username:name},function(err,item){
        if(err){
            console.log(err)
        }
        else{
            console.log(item)
            if(item){
                if(item.password==pass){
                    res.render('secrets')
                }
                else{
                    res.redirect('/login')
                }
            }

        }
    })
})
app.get('/logout',function(req,res){
    res.redirect('/')
})
app.get('/submit',function(req,res){
    res.render('submit')
})












app.listen(3000,function(){
    console.log('server running at port 3000')
})