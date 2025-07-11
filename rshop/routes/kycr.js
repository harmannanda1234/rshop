const express = require("express")
const { getdetailsbyid, kycform } = require("../controllers/kyc")
const kycr= express.Router()

kycr.get("/kyc/:email",getdetailsbyid)
kycr.post("/kyc",kycform)


module.exports= kycr