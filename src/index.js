
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path: './.env'
})


const port = process.env.PORT || 8000;

// app.get('/', (req, res) => {
//     res.send('🚀 Backend is live!');
// });

app.get("/", (req, res) => {
    res.status(200).json({ message: "API is healthy!" });
  });
  

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGODB connection failed !!! ", err);
})





// "start": "node --env-file=.env src/index.js",    
//     "dev": "nodemon --env-file=.env src/index.js"

/*

import express from "express"
const app = express()

(async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("EROOR: ", error)
            throw error
            })
            
            app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
            })

            } catch(error){
        console.error("ERROR: ", error)
        throw err
    }
    })()

    */
   // import OpenAI from "openai";
   // import Configuration from "openai"
   
   // const configuration = new Configuration({
   //     apiKey: process.env.OPENAI_API_KEY,
   //   });
   
   // const openai = new OpenAI(configuration);  
   
   
   
   // app.get('/getResponse', async (req, res) => {
   //     const userPrompt = req.body.userPrompt;      
   //     const response = await openai.chat.completions.create({
   //         model: 'gpt-4', 
   //         messages: [{"role": "user", "content" : userPrompt }]
   //     })
   //     console.log(response.choices[0].message.content);
   //     res.send(response.choices[0].message.content)
       
   // })
   //require('dotenv').config({path: './env'})
