//to create router
import express from 'express'
//to use encryption
import bcrypt from 'bcryptjs'
//to use JWT tokens
import jwt from 'jsonwebtoken'
//to use database
import db from '../database.js'

// import jwt from 'jsonwebtoken'

const router=express.Router()

router.post('/register',(req,res)=>{
    const {username,password,email}=req.body

    //password encryption
    const encryptedPassword=bcrypt.hashSync(password,12)

    try{
        const newUser=db.prepare('INSERT INTO users (username, password,email,money) VALUES (?,?,?,?)')
        const result = newUser.run(username,encryptedPassword,email,100)
        
        res.status(201).json({ message: "User registered successfully" })
    }catch(err){
        console.log(err.message)
        res.status(503).json({ message: "Database error: " + err.message })
    }
})


router.post('/login',(req,res)=>{
    const {username,password}=req.body


    try{
        const getUser=db.prepare('SELECT * FROM users WHERE username =?')
        const user = getUser.get(username)
        
        //check if user is registered
        if(!user){return res.status(404).send({message: "user doesnt exist"})}

        //check if the password is valid
        const validPassword=bcrypt.compareSync(password,user.password)
        if(!validPassword){return res.status(401).send({message:"nice try bro. Use some valid password"})}

        // res.status(201).json({ message: "Logged in successfully" })
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token : token, username: user.username ,email: user.email, money: user.money })

    }catch(err){
        console.log(err.message)
        res.status(503).json({ message: "Database error: " + err.message })
    }
})








export default router