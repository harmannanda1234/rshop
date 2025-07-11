const jwt = require('jsonwebtoken');
const pool = require('../db');

const verify = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1]
    if(!token){
        return res.status(404).json({
            message:"token not found"
        })
    }
     try {
        const decoded = jwt.verify(token,"secretkeysabby");
        req.user = decoded; 
        // console.log(decoded)
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};


const auction_verify = async (req,res,next)=>{
    let { email } = req.body;
    // const email = 'absbhb'
    try {
        if(!email){
            return res.status(404).json({
                message:"email not verified"
            })
        }

        const squery= "SELECT status from kyc where email = ?"
        const [status]= await pool.execute(squery,[email])
        if(status.length===0){
            return res.json({
                message:"not verified"
            })
        }
        console.log(status[0])

        if(status[0].status==='verified'){
            return next()
        }

        return res.json({
            message:"not verified"
        })
    } catch (error) {
        return res.json({
            message: error.message
                }) 
    }
}

module.exports={
    verify,
    auction_verify
}