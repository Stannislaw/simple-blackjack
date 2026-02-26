//to create router
import express from 'express'
//to use database
import db from '../database.js'

// import jwt from 'jsonwebtoken'

const router=express.Router()

router.get('/getMoney',(req,res)=>{
    const getMoney=db.prepare('SELECT money FROM users WHERE id=?')
    const row = getMoney.get(req.userId)
    res.json({ money: row ? row.money : 0 })
})

router.put('/updateMoney',(req,res)=>{
    const newMoneyValue = req.body.money

    if (typeof newMoneyValue !== 'number' || Number.isNaN(newMoneyValue)) {
        return res.status(400).json({ message: "Invalid money value" })
    }

    const updateMoney = db.prepare('UPDATE users SET money=? WHERE id=?')
    updateMoney.run(newMoneyValue, req.userId)

    res.json({ message: "updated money value", money: newMoneyValue })
})






export default router