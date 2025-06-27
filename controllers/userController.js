import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from'dotenv';
import axios from "axios";
import e from "express";
//load dotenv
dotenv.config()

export function saveUser(req,res){
    if(req.body.role == "admin"){
        if(req.user == null){
            res.status(403).json({
                message : "Please login as admin before creating an admin account"
            })
            return;
        }

        if(req.user.role != "admin"){
            res.status(403).json({
                message : "You are not authorized to create an admin account"
            })
            return;
        }
    }

    const hasedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new User({
        email : req.body.email,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        password : hasedPassword,
        role : req.body.role
    })
    user.save().then(
        ()=>{
            res.json({
                message : "User saved successfully"
            })
        }
    ).catch(
        (err)=>{
            res.status(500).json({
                message : "User not saved"
            })
        }
    )
}

export function loginUser (req,res){
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email : email
    }).then(
        (user)=>{
            if(user == null){
                res.status(404).json({
                    message : "Invalid email"
                })
            }else{
                const isPasswordCorrect = bcrypt.compareSync(password, user.password);

                //check for user.isDisabled
                //check for invalid attempts
                //if invalid attempts > 3 AND user.blockUntil > Date.now() res

                if(isPasswordCorrect){
                    const userData = {
                        email : user.email,
                        firstName : user.firstName,
                        lastName : user.lastName,
                        role : user.role,
                        phone : user.phone,
                        isDisabled : user.isDisabled,
                        IsEmailVerified : user.isEmailVerified
                    }

                    const token = jwt.sign(userData, process.env.JWT_KEY,{
                        expiresIn : "48hrs"
                    });

                    res.json({
                        message : "Login Successful!!",
                        token : token,
                        user : userData //take the userdata to the frontend
                    })
                }else{
                    res.status(403).json({
                        message : "Invalid Password!!"
                    })
                    //user -> blockUntil = Date.now() + 5*60*1000
                    //user -> inValidAttempts = default=0 +1
                    //if(user.inValidAttempts > 3){
                    // user.isDisabled = true
                }
            }
        }
    )
}

export async function googleLogin(req,res) {
    const accessToken = req.body.accessToken;
    
    try{
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{
            headers: {
                Authorization: "Bearer "+ accessToken
            }
        })
        
        const user = await User.findOne({
            email: response.data.email
        });

        if(user == null){
            const newUser = new User({
                email: response.data.email,
                firstName: response.data.given_name,
                lastName: response.data.family_name,
                isEmailVerified: true, // assuming email is verified by Google
                password: accessToken // storing access token as password for simplicity
            });

            await newUser.save();
            
            const userData = {
               email : response.data.email,
                firstName : response.data.given_name,
                lastName : response.data.family_name,
                role : "user", // default role for new users
                phone : response.data.phone || "", // Google may not provide phone number
                isDisabled : false, // default value
                IsEmailVerified : true // assuming email is verified by Google
            }
            

            const token = jwt.sign(userData, process.env.JWT_KEY, {
                expiresIn: "48hrs"
            });

            res.json({
                message: "Login Successful!!",
                token: token,
                user: userData //take the userdata to the frontend
            });

        }else{
            const userData = {
                email : user.email,
                firstName : user.firstName,
                lastName : user.lastName,
                role : user.role,
                phone : user.phone,
                isDisabled : user.isDisabled,
                IsEmailVerified : user.isEmailVerified
            }
            

            const token = jwt.sign(userData, process.env.JWT_KEY, {
                expiresIn: "48hrs"
            });

            res.json({
                message: "Login Successful!!",
                token: token,
                user: userData //take the userdata to the frontend
            });
        }




    }catch(err) {
        res.status(500).json({
            message: "Google login failed"
        });
    }
}
