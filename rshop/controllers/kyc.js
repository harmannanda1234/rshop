const pool = require("../db")

const getdetailsbyid = async (req,res)=>{
    let{email}=req.params;
    try {
        const query = 'SELECT * FROM kyc WHERE email =?';
        const [result]= await pool.execute(query,[email]);
        // console.log(result)
        if(result.length===0){
            return res.status(404).json({
                message:"not found"
            })
        }

        return res.status(200).json({
            result:result[0]
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

const kycform = async(req,res)=>{
    let {aadhaar , email , phone}= req.body;
    try {
        if(!aadhaar || !email || !phone){
            return res.json({
                message:"invalid request"
            })
        }

        const query = "INSERT INTO kyc (adhar_no,email,phone) VALUES(?,?,?)"
        await pool.execute(query,[aadhaar,email,phone])
        return res.status(201).json({
            message:"successfully filled form",
            status:"success"
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }

}

const statusupdate = async (res,req)=>{  //admin only route 
    let {email,status}= req.body;
    try {
        if(!email){
            return res.json({
                message:"invalid request"
            })
        }

        const query = "UPDATE kyc SET status =? where email =?"
        await pool.execute(query,[status,email])

    } catch (error) {
        
    }
}


module.exports= {
    getdetailsbyid,
    kycform,
    statusupdate
}