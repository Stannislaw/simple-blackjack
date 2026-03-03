//enables access the path and navigate between files and directories in the project
import {fileURLToPath} from 'url'
//http server framework. spares much work
import express from 'express'
//load env variables from .env
import dotenv from 'dotenv'
//to enable using authorisation
import authRoutes from "./routes/authenticationRoutes.js"
//to confirm accurate token is provided
import authMiddleware from './middleware/authMiddleware.js'
//to access userData api 
import userDataRoutes from './routes/userDataRoutes.js'

import path, { dirname } from  'path'
//creation of a server instance
const app=express()

//loads environment variables into process.env
dotenv.config()

//specifies a port from env variables. If the variable is unavailable, uses value 1234
const PORT = process.env.PORT || 1234
  
//get the dirname 
const __filename =fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//tell the server to parse json in the request body authomatically
app.use(express.json())

//servers the html from directory /public
//informs the server that all the files in this directory are static
//all the requests for static files will be redirected there
app.use(express.static(path.join(__dirname,'../public')))
app.use('/site_logic', express.static(path.join(__dirname, 'site_logic')))


 
//reaction when the user tries to access localhost:PORT
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public','index.html'))
})

// routes
app.use('/auth',authRoutes)
app.use('/userData',authMiddleware,userDataRoutes)

app.listen(PORT,()=>{
    console.log(`server has started on port : ${PORT}`)
})



 

 





