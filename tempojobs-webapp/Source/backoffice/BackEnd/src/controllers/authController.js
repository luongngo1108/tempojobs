import User from "../models/userModel.js";
import {createToken} from "../utils/jwtTokenUtils.js";
import { hash, compare } from 'bcrypt';

class authController {
    // [POST] /register
    async register(req, res, next) {
        const{username, email, password} = req.body;
        if(!username || !email || !password) {
            res.status(400);
            throw new Error("All fields are madatory");
        }

        const userAvailable = await User.findOne({email});
        if(userAvailable) {
            res.status(400).json("User already registered");
            return;
            //throw new Error("User already registered");
        }

        //Hash password
        const hashedPassword = await hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        if(user) {
            res.status(201).json({_id: user.id, email: user.email})
        } else {
            res.status(400).json("Email or password is not valid!");
        }
    }

    // [GET] /login
    async login(req, res, next) {
        const {email, password} = req.body;
        console.log(email, password);
        if(!email || !password) {
            res.status(400).json("All fields are madatory");
            return;
        }

        const user = await User.findOne({email});
        
        //compare password with hashedpassword
        if(user && (await compare(password, user.password))) {
            
            const accessToken = createToken(
            {
                username: user.username, 
                email: user.email, 
                id: user.id,
                role: user.role,
            });
            
            res.status(200).json({accessToken});
        } else {
            res.status(401).json("Email or password is not valid");
            return;
        }
    }

    // [POST] /current
    async getCurrentUser(req, res, next) {
        res.status(200).json(req.user);
    }
}

export default new authController;