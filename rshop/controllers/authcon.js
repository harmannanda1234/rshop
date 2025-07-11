const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require("../db")


const signup = async (req,res)=>{
    let {name , email , phone , password}=req.body
    if(!name || !email || !phone || !password){
        return res.status(400).json({
            message:"invalid request"
        })
    }

    try {
        const hashed = await bcrypt.hash(password,10)
        if(!hashed){
            return res.status(400).json({
                message:"invalid cred error cant store data"
            })
        }
        const query = " INSERT INTO users VALUES(?,?,?,?)"
        await pool.execute(query,[name ,email ,phone , hashed])
        return res.status(201).json({
            message:"success"
        })
    } catch (error) {
        return res.status(500).json({
            error:error.message
        })
    }

}

const login = async (req,res)=>{
    let{mail, phone, password}= req.body
    if(!mail || !password || !phone){
        return res.status(400).json({
            message:"invalid cred"
        })
    }

    try {
        const passq = "SELECT password from users where email =? && phone = ?"
        const [paswo] = await pool.execute(passq,[mail,phone])
        if(paswo.length===0){
            return res.json({
                message:"invalid credentials"
            })
        }
        const userp = paswo[0].password
        const pmatch = await bcrypt.compare(password,userp)
        if(!pmatch){
            return res.status(400).json({
                messsage:"wrong password"
            })
        }

        const token = jwt.sign({
            mail,
            phone
        },"secretkeysabby",{
            expiresIn:'1d'
        })

        res.setHeader("Authorization",`Bearer ${token}`)
        return res.status(200).json({
            message:"login successful",
            token:`Bearer ${token}`
        })
    } catch (error) {
        return res.json({
            error:error.message
        })
    }

}

const otplogin= async (req,res)=>{
    
}


module.exports={
    signup,
    otplogin,
    login
}