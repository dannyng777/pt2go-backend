// MERN  = Mongo + Express + React + Node

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model');

app.use(cors())
app.use(express.json()) //changing everything from body to JSON. 

mongoose.connect('mongodb+srv://danny-admin:Nguyeners@cluster0.blclp5t.mongodb.net/?retryWrites=true&w=majority')

app.post('/api/register',async (req,res) => {
    const { firstname, lastname, email, password, occupation } = req.body
    console.log(req.body)
    User.findOne({email:email}).then(user => {
        if (user) {
            console.log('Email already exists');
        } else {
            try {
                bcrypt.hash(password, 10, (err, hash) => {
                    User.create({
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        password: hash,
                        occupation: occupation
                    }) 
                }) 
            } catch (error) {
                res.json({status:'error', error:"Unable to create account"})
            }
            res.json({status:'ok'})
        }
    })
})

app.post('/api/login',async (req,res)=>{
    const { email, password } = req.body
    console.log(req.body)
    const user = await User.findOne({
        email: email
    })
       try {
        if (await bcrypt.compare(password, user.password)){
            return res.json({status:'ok', accountInfo:{user,isLoggedIn:true}})
          
        } else {
            console.log('Wrong password')
        }
       } catch {
        //  res.status(500).send()
        console.log('No account found')
     }
})

app.post('/api/addExercise',async(req,res)=>{
    const exercisesArray = req.body.exercisesArray //change this to specific exercise
    const email = req.body.email
    // console.log(exercisesArray,email,"inside Post request")
    const updateExercises = await User.updateOne({email},{$push:{exercises:exercisesArray}})
    const user = await User.findOne({
        email
    })
    console.log(user,'updated user')
    // return res.json({status:'ok', accountExercises:{user}})
})

app.post('/api/deleteExercise',async(req,res)=>{
    const index = req.body.index 
    const email = req.body.email
    console.log(email,index,"inside backend")
    await User.updateOne({email},{$unset:{"exercises.0":index}}) //set array to null then remove null 
    await User.updateOne({email},{$pull:{"exercises":null}})
})

app.listen(1337, ()=>{
    console.log('Server is listening on 1337')
})