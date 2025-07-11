const express = require('express')
const { aucform, allauc, aucinfo, billgen, endauc, mybill } = require('../controllers/auctionlisting')
const { auction_verify } = require('../middlewares/verifytoken')
const listing = express.Router()

listing.post("/list",auction_verify,aucform)
listing.get("/listed",allauc)
listing.get("/listed/:id",aucinfo)
listing.post("/ended",endauc)
listing.post("/bill",billgen)
listing.post("/getbill",mybill)

module.exports=listing