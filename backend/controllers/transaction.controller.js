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

    if(!fromAccount || !toAccount || !amount || !idempotencyKey)
    {
        return res.status(400).json({
            message:"Missing required fields"
        })
    }

    //checking whether the fromAccount and toAccount are valid
    const fromUserAccount=await accountModel.findOne({
        _id:fromAccount,
    })

    const toUserAccount=await accountModel.findOne({
        _id:toAccount
    })

    if(!fromUserAccount || !toUserAccount)
    {
        return res.status(400).json({
            message:"Invalid account(s)"
        })
    }


    //validating idempotency key

    const isTransactionAlreadyExists=await TransactionModel.findOne({
        idempotencyKey:idempotencyKey
    })

    if(isTransactionAlreadyExists)
    {
        //considering that it is completed.
        if(isTransactionAlreadyExists.status==="COMPLETED")
        {
            return res.status(200).json({
                message:"Transaction already completed",
                transaction:isTransactionAlreadyExists  
            })
        }

        else if(isTransactionAlreadyExists.status==="PENDING")
        {
            return res.status(400).json({
                message:"Transaction is still processing, please wait for it to complete"
            })
        }
        
        else if(isTransactionAlreadyExists.status==="FAILED")
        {
            return res.status(500).json({
                message:"Transaction failed, please try again"
            })
        }

        else if(isTransactionAlreadyExists.status==="REVERSED")
        {
            return res.status(400).json({
                message:"Transaction has been reversed,please try again"
            })
        }
    }


    //checking Account status

    if(fromUserAccount.status!=="ACTIVE" || toUserAccount.status!=="ACTIVE")
    {
        return res.status(400).json({
            message:"One or both accounts are not active"
        })
    }

    //Deriving sender's balance from ledger

    const balance=await fromUserAccount.getBalance();

    if(balance<amount)
    {
        return res.status(400).json({
            message:`Insufficient balance. Current balance is ${balance}, requested amount is ${amount}`
        })
    }


    //creating a new transaction 
    const session=await mongoose.startSession();
    session.startTransaction();

    const transaction=await TransactionModel.create([{
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    }],{session})

    const debitLedgerEntry=await LedgerModel.create({
        account:fromAccount,
        amount:amount,
        transaction:transaction[0]._id,
        type:"DEBIT"
    },{session})

    const creditLedgerEntry=await LedgerModel.create({
        account:toAccount,
        amount:amount,
        transaction:transaction[0]._id,
        type:"CREDIT"
    },{session})


    transaction.status="COMPLETED";
    await transaction.save({session});

    await session.commitTransaction();
    session.endSession();


    //SENDING EMAIL NOTIFICATION TO THE SENDER

    await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount);

    return res.status(201).json({
        message:"Transaction completed successfully",
        transaction:transaction
    })
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