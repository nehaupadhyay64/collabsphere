import jwt from "jsonwebtoken";
import User from "../models/User.js";
import config from "../config/index.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async(req,res,next) => {
    const header = req.headers.authorization;
    if(!header|| !header.startsWith("Bearer"))
        return res.status(401).json({message:"Not logged in"});
    try{
        const decoded = jwt.verify(header.split(" ")[1],config.jwtSecret);
        req.user = await User.findById(decoded.id).select("-password");
        if(!req.user) return res.status(401).json({message:"User not found"});
        next();
    }catch{
        return res.status(401).json({message: "Invalid or expired token"});
    }
});