const {Router}=require("express");
const authMiddleware=require("../middleware/auth.middleware")
const transactionController=require("../controllers/transaction.controller")
const transactionRoutes=Router();

//creating a new transaction
transactionRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction);

transactionRoutes.post("/system/initial_funds",authMiddleware.authSystemUserMiddleware,transactionController.createInitialFundsTransaction)
module.exports=transactionRoutes;