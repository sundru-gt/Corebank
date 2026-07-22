const express=require('express')
const authMiddleware=require('../middleware/auth.middleware')
const accountController=require('../controllers/account.controller')

const router=express.Router();
router.post("/",authMiddleware.authMiddleware,accountController.createAccountController)

//API For fetching all accounts of a user
router.get("/",authMiddleware.authMiddleware,accountController.getUserAccountController)
module.exports=router