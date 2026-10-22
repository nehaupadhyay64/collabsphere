import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";

export const register = asyncHandler(async(req,res)=>{
    const{name,password} = req.body;
    const email = req.body.email?.toLowerCase().trim();

    if(!name || !email || !password)
        return res.status(400).json({message:"All fields are required"});
    if(await User.findOne({email}))
        return res.status(400).json({message:"Email already registered"});

    const hashed = await bcrypt.hash(password,10);
    const user = await User.create({name,email,password:hashed});
    res.status(201).json({
        user:{_id:user._id, name:user.name, email:user.email},
        token:generateToken(user._id),
    });
});
export const login = asyncHandler(async(req,res)=>{
    const{password} = req.body;
    const email = req.body.email?.toLowerCase().trim();

    
   const user = await User.findOne({ email });
   if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid email or password" });

   res.json({
    user:{_id: user._id, name:user.name, email: user.email},
    token:generateToken(user._id),
   });
});
export const getMe = (req,res) => res.json({user:req.user});