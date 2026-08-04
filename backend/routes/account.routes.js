const express=require('express')
const authMiddleware=require('../middleware/auth.middleware')
const accountController=require('../controllers/account.controller')

const router=express.Router();
router.post("/",authMiddleware.authMiddleware,accountController.createAccountController)

//API For fetching all accounts of a user
router.get("/",authMiddleware.authMiddleware,accountController.getUserAccountController)

//API For fetching BALANCE of a user account
router.get("/balance/:accountId",authMiddleware.authMiddleware,accountController.getAccountBalanceController)
module.exports=router