import { User } from "../models/user.model.js"
import ApiError from  "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"

export const verifyJwt = asyncHandler(async (req , res , next) =>
{
    try {

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token)
            {
                throw new ApiError(401 ,"unauthorised request")
            }
    
            const decodedToken =  jwt.verify(token , process.env.SECRET_ACCESS_TOKEN) 
            if (!decodedToken || !decodedToken._id) {
                throw new ApiError(401, "Invalid token structure");
            }
            //const userId = new ObjectId(decodedToken._id); // Convert string to ObjectId
            const user = await User.findById(decodedToken._id).select("-password -refreshToken");
            if(!user)
                {
                    throw new ApiError(401,"No user found.Signin first")
                }
    
                req.user = user;  
                next() 
    } 
    catch (error) {
        if (error) {
            next(new ApiError(401, "Invalid access token"));
    }
}




})