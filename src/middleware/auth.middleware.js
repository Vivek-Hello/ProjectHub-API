import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// const authMiddleware = async (req,res) => {
//     try {
//         const accesstoken = req.cookies('accesstoken');
//         if (!accesstoken){
//             const refreshtoken = req.cookies('refreshtoken');
//             const decode = jwt.verify(refreshtoken,process.env.REFRESH_TOKEN);
//             const user = await User.findById(decode.id);
//             if (!user) return res.status(400).json({message:"token are expired Login againg please"});
//             req.user = user;
//             return next();
//         }
//         const decode = jwt.verify(accesstoken,process.env.ACCESS_TOKEN);
//         const user = await User.findById(decode.id);
//         if (!user) return res.status(400).json({message:"token are expired Login againg please"});
//         req.user = user;
//         return next();
//     } catch (err) {
//         console.error("Unauthorized ",err.message);
//         return res.status(410).json({message:"Unauthorized to user this page"});
//     }
// }

const authMiddleware = async (req,res) => {
    try {
        const accesstoken = req.cookies.accesstoken;
       
        const decode = jwt.verify(accesstoken,process.env.ACCESS_TOKEN);
 
        if (!decode) return res.status(401).json({message:"Unauthorized to access"});

        const user = await User.findById(decode.id);

        if (!user)  return res.status(401).json({message:"User might not have access"});

        req.user = user;
        next();

    } catch (err) {
        console.error("Unauthorized ",err.message);
        return res.status(410).json({message:"Unauthorized to user this page"});
    }
}