import { Request, Response } from "express";
import User from "../models/user.models";
import bcrypt from 'bcryptjs'
import { generateToken } from "../util/token";


export const registerUser = async(req:Request, res:Response): Promise<void> =>{

    try {
        const { email, password, name, avatar} = req.body

        if(!email || !password || !name) {
            res.status(400).json({
                success: false,
                message: "All fields are required"

            })
            return
        }

        let user = await User.findOne({ email })
        if(user) {
            res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        user = new User({
            email,
            password,
            name,
            avatar
        })
        
        // hash password
        const salt =  await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)


        await user.save()

        // generate token 
        const token = generateToken(user)

        res.status(201).json({
            success: true,
            token
        })
        
    } catch (error) {
        console.log('Error', error)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }

}

export const loginUser = async(req:Request, res:Response): Promise<void> =>{

    const { email, password} = req.body
    try {

        const user = await User.findOne({ email })

        if(!user){
            res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
            return
        
        }

        // compare password

        const isMatch = await bcrypt.compare(password, user.password)
        
        if(!isMatch){
            res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
            return
        }

        // gen token 
        const token =  generateToken(user)
        res.status(200).json({
            success: true,
            token
        })
        
    } catch (error) {
        console.log('Error', error)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }

}