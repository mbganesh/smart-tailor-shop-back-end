// const express = require("express");
// const mongoose = require('mongoose');

import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import router from './router.js'

import registrationRouter from './registrationRouter.js'

import adminRouter from './adminRouter.js'

import cluster from 'cluster'
import os from 'os'
 
const numCpu = os.cpus().length


const app = express();

app.use(cors())

const port = 3002


//body-parser

app.use(express.json({ extended: false, limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }))




app.get("/",(req,res)=> {
    res.json("Router is working");
});

app.use('/api', router);
app.use('/registrationProcess' , registrationRouter)
app.use('/adminRouter' , adminRouter)



if (cluster.isPrimary) {
    for (let i = 0; i < numCpu; i++) {
        cluster.fork()//create separate cpu
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker died ${worker.process.pid}`)
        cluster.fork()
  
    })
 }
 else {
    app.listen(port, () => console.log(` server ${process.pid},
 Backend Running...`))
 }
 

