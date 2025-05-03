import { ApiResponse } from "./utils/ApiResponse.js"
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path: './.env'
})


const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('🚀 Backend is live!');
});

app.get('/api/v1/ping', (req, res) => {
    res.status(200).send('pong');
  });
  

// app.get("/", (req, res) => {
//     res.status(200).json(new ApiResponse(200, "🚀 Containerized Backend is live!"));
//   });
  

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`⚙️ Server is running at port : ${port}`);
    })
})
.catch((err) => {
    console.log("MONGODB connection failed !!! ", err);
})
