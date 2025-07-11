const { json } = require("express");
const pool  = require("../db");

const aucform = async (req,res)=>{
    let {email , title ,description,image , baseprice,startdate}= req.body
    if(!email || !title || !description || !image || !baseprice||!startdate ){
        return res.json({
            message:"invalid request"
        })
    }
try {
    const query = "INSERT INTO auction_items (email , title , description,image_url,base_price,auction_start) VALUES(?,?,?,?,?,?)"
    await pool.execute(query,[email,title,description,image,baseprice,startdate])

    return res.json({
        message:'item listed successfully',
        status:"success"
    })
    
} catch (error) {
    return res.json({
        error:error.message
    })
}
}

const allauc = async (req, res) => {
  try {
    const result = await pool.execute("SELECT * FROM auction_items");
    // console.log("Raw DB result:", result);

    const response = result[0]; // rows
    if (!response || response.length === 0) {
      return res.json({
        message: "invalid",
        response: []
      });
    }

    return res.json({
      status: "success",
      response
    });
  } catch (error) {
    console.error("Backend Error:", error);
    return res.json({
      error: error.message
    });
  }
};

const aucinfo = async (req, res) => {
  try {
    const {id} = req.params

    const result = await pool.execute("SELECT * FROM auction_items WHERE id = ?",[id]);
    // console.log("Raw DB result:", result);

    const response = result[0]; // rows
    if (!response || response.length === 0) {
      return res.json({
        message: "invalid",
        response: []
      });
    }

    return res.json({
      status: "success",
      response
    });
  } catch (error) {
    console.error("Backend Error:", error);
    return res.json({
      error: error.message
    });
  }
};

const endauc = async(req, res)=>{
  try {
    let { id }= req.body;
    if(!id)return res.json({message:"invalid req"})
      
    const query = " update auction_items set status = 'ended' where id = ?"
    await pool.execute(query,[id])

    return res.json({
      status : 201,
      message:"auction ended"
    })
  } catch (error) {
    return res.json({
      status:500,
      message: error.message 
    })
  }
}

const billgen =async (req,res)=>{
  try {
    let {id , buyer, seller , price}= req.body
    if(!id || ! buyer || ! seller||!price){
      return res.json({
        message:"invalid request",
        status:404
      })
    }

    const query = "INSERT INTO orders (id , buyer , seller, price) VALUES (?,?,?,?)"
    await pool.execute(query,[id,buyer,seller,price])

    return res.json({
      message:"bill generated successfully",
      status:201
    })
  } catch (error) {
    return res.json({
      error : error.message
    })
  }
}

const mybill = async(req,res)=>{
  let { email } = req.body
  try {
    if(!email)return res.json({message:"invalid req"})

    const query = "SELECT * from orders where buyer = ? or seller =?"
    const [rows] = await pool.execute(query,[email,email])
    // console.log(rows)

    if(rows.length===0)return res.json({message:"no orders yet"})

    return res.json({
      result:rows[0],
      message:"success"
    })
    
  } catch (error) {
    
  }
}

module.exports= {
    aucform,
    allauc,
    aucinfo,
    endauc,
    billgen,
    mybill
}