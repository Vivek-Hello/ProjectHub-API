import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1","0.0.0.0"]);

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3001;





app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT} http://localhost:${PORT}`);
});