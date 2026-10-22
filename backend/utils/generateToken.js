import jwt from "jsonwebtoken";
import config from "../config/index.js";

const generateToken = (id) =>
    jwt.sign({id},config.jwtSecret,{expiresIn: "7d"});
export default generateToken;