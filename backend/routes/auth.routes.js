const express =require("express")
const authController=require("../controllers/auth.controller")
const router=express.Router()

// POST-> auth/api/register 
router.post("/register",authController.userRegisterController)

//POST->auth/api/login
router.post("/login",authController.userLoginController)
module.exports = router