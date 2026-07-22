const TransactionModel=require("../models/transaction.model");
const LedgerModel=require("../models/ledger.model");
const accountModel=require("../models/account.model");
const emailService=require("../services/email.service");
const mongoose=require("mongoose");
//creating a new transaction
//step flow
/*
1-VALIDATE REQUEST
2-VALIDATE IDEMPOTENCY KEY
3-CHECK ACCOUNT STATUS
4-DERIVE SENDER'S BALANCE FROM LEDGER
5-CREATE A PENDING TRANSACTION
6- CREATE LEDGER ENTRIES FOR BOTH ACCOUNTS
7-UPDATE TRANSACTION STATUS TO COMPLETED
8-COMMIT MONGODB SESSION
9-SEND EMAIL NOTIFICATION TO BOTH ACCOUNTS
*/

async function createTransaction(req,res){
    const {fromAccount,toAccount,amount,idempotencyKey}=req.body;
}

async function createInitialFundsTransaction(req,res)
{
    const {toAccount,amount,idempotencyKey}=req.body;

    if(!toAccount || !amount || !idempotencyKey)
    {
        return res.status(400).json({
            message:"Missing required fields"
        })
    }

    const toUserAccount=await accountModel.findOne({
        _id:toAccount});


    if(!toUserAccount)
    {
        return res.status(400).json({
            message:"Invalid toAccount"
        })
    }
    
    const fromUserAccount=await accountModel.findOne({
        user:req.user._id
    })
    console.log(fromUserAccount);
    //in case system user is deleted by mistake
    if(!fromUserAccount)
    {
        return res.status(400).json({
            message:"System user account not found"
        })
    }


    const session=await mongoose.startSession();
    session.startTransaction(); 

    const transaction= new TransactionModel({
        fromAccount:fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    })
    console.log("check one is correct");
    const debitLedgerEntry=await LedgerModel.create([{
        account:fromUserAccount._id,
        transaction:transaction._id,
        type:"DEBIT",
        amount:amount
    }],{session})

    const creditLedgerEntry=await LedgerModel.create([{
        account:toUserAccount._id,
        transaction:transaction._id,
        type:"CREDIT",
        amount:amount
    }],{session})


    transaction.status="COMPLETED";
    await transaction.save({session});

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
        message:"Initial funds transaction created successfully",
        transaction
    })

    
}

module.exports={
    createTransaction,
    createInitialFundsTransaction
}