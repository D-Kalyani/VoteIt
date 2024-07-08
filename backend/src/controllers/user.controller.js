import { User } from "../models/user.model.js"
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

const ObjectId = mongoose.Types.ObjectId;


const generateTokens = async(userId) =>
    {
        try{
            const user = await User.findById(userId)        
            const accessToken = user.generateAccessToken()
            const refreshToken = user.generateRefreshToken()
    
            user.refreshToken = refreshToken            
            
            await user.save({validateBeforeSave : false})          
            return {accessToken , refreshToken}
        }
        catch{
            throw new ApiError(500 , "something went wrong while generating tokens")
        }
    }


const signup = asyncHandler(async(req,res,next) => {

    const {username , email ,password} = req.body;

    if([username,email,password].some((field) =>
    {
        field?.trim()===""
    }))
    {
        throw new ApiError(402 ,"All fields are required")
    }

    const userExists = await User.findOne({
        $or : [{username} , {email}]
    })

    if(userExists)
        {
            throw new ApiError(402 , "Username or email already exists")
        }

    const user = await User.create({
        username,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser)
        {
            throw new ApiError(404 , "could not register the user")
        }

    res
    .status(200)
    .json(
        new ApiResponse(200 , createdUser ,"user registered successfully!")
    )

})



const login = asyncHandler(async (req,res) =>
{
    const {username , password} = req.body

    if(!username || !password)
        {
            throw new ApiError(402,"both fields are required")
        }

    const user = await User.findOne({
        username
    })

    if(!user){
        throw new ApiError(404 , "No username found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid)
        {
            throw new ApiError(401 , "password incorrect")
        } 

        const{accessToken , refreshToken} = await generateTokens(user._id)

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        const options = {
            httpOnly:true,//so that client side js does not see the cookie
            secure:true, //cookies now cannot be modifie by frontend only by backend 

        }

        res.status(200)
        .cookie("accessToken" , accessToken , options)
        .cookie("refreshToken" , refreshToken ,options)
        .json(
            new ApiResponse(200 , {user:loggedInUser , accessToken ,refreshToken} ,"User logged in successfully")
        )


})

    const getCurrentUser = asyncHandler(async(req,res) =>
        {
            return res.status(200)
            .json(200 ,req.user , "current user fetched successfully")
        })

 const refreshAccessToken = asyncHandler(async(req,res) =>
            {
                const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken 
                console.log(incomingRefreshToken)
            
                if(!incomingRefreshToken)
                    {
                        throw new ApiError(401,"unauthorized request")
                    }
            
                    try {
                        const decodedToken = jwt.verify(incomingRefreshToken , process.env.SECRET_REFRESH_TOKEN)
                        console.log(decodedToken)
                        if (!decodedToken || !decodedToken._id) {
                            throw new ApiError(401, "Invalid token structure");
                        }

                        const userId = new ObjectId(decodedToken._id); // Convert string to ObjectId
                        const user = await User.findById(userId).select("-password");
                        console.log(decodedToken)
                        console.log(user)


                        if(!user)
                            {
                                throw new ApiError(401,"invalid refresh token")
                            }

                        //matching
                        console.log(user.refreshToken)
                        if(incomingRefreshToken !== user?.refreshToken)     
                            {
                                throw new ApiError(401,"refresh token is expired or used")
                            }
                
                            const options = {
                                httpOnly:true,
                                secure:true, //cookies now cannot be modifie by frontend only by backend 
                        
                            }
                
                            const { accessToken , newrefreshToken } = await generateTokens(user._id) 

                            return res
                            .status(200)
                            .cookie("accessToken" , accessToken,options)
                            .cookie("refreshToken" , newrefreshToken,options)
                            .json(new ApiResponse(200 , {user ,accessToken,refreshToken : newrefreshToken} , "access token refreshed successfully")
                               
                            )
                    } 
                    catch (error) {
                        throw new ApiError(401 , error?.message || "invalid refresh token")
                    }
            })

const logoutUser = asyncHandler(async(req, res) => {
                await User.findByIdAndUpdate(
                    req.user._id,
                    {
                        $unset: {
                            refreshToken: 1 // removes field from document
                        }
                    },
                    { new: true }
                );
            
                const options = {
                    httpOnly: true,
                    secure: true,
                };
            
                return res
                    .status(200)
                    .clearCookie("accessToken", options)
                    .clearCookie("refreshToken", options)
                    .json(
                        new ApiResponse(
                            200,
                            {},
                            "User logout successfull !!!."
                        )
                    );
            });
            
            

export {signup , login , getCurrentUser ,refreshAccessToken , logoutUser}