import User from "../models/userModel.js";
import UserDetail from "../models/userDetailModel.js";
import Token from "../models/tokenModel.js"
import { createToken } from "../utils/jwtTokenUtils.js";
import { hash, compare } from 'bcrypt';
import { ReturnResult } from "../DTO/returnResult.js";
import { sendEmail } from "../utils/emailUtil.js";
import { ObjectId } from "mongoose";
import crypto from "crypto";
import googleMapLocationModel from "../models/googleMapLocationModel.js";

class authController {
    // [POST] /register
    async register(req, res, next) {
        const { firstName, lastName, email, password, role } = req.body;
        if (!firstName || !email || !password) {
            res.status(400);
            throw new Error("All fields are madatory");
        }
        const userAvailable = await User.findOne({ email });
        if (userAvailable) {
            res.status(400).json("Email đã được đăng ký, vui lòng chọn email khác!");
            return;
        }

        //Hash password
        const hashedPassword = await hash(password, 10);
        const googleLocation = await googleMapLocationModel.create({});
        const userDetail = await UserDetail.create({
            firstName,
            lastName,
            googleLocation,
            email,
            evaluation: [],
        })

        const user = await User.create({
            displayName: firstName + " " + lastName,
            email,
            password: hashedPassword,
            userDetail: userDetail,
            role
        });

        if (user) {
            const accessToken = createToken(
                {
                    displayName: user.displayName,
                    email: user.email,
                    id: user.id,
                    role: user.role,
                });

            res.status(200).json({ accessToken });
        } else {
            res.status(400).json("Email hoặc mật khẩu không hợp lệ!");
        }
    }

    // [GET] /login
    async login(req, res, next) {
        const { email, password } = req.body;
        let role = req.params.role;
        if (!email || !password) {
            res.status(400).json("All fields are madatory");
            return;
        }

        const user = await User.findOne({ email, role });
        //compare password with hashedpassword
        if (user && (await compare(password, user.password))) {

            const accessToken = createToken(
                {
                    displayName: user.displayName,
                    email: user.email,
                    id: user.id,
                    role: user.role,
                });
            res.status(200).json({ accessToken });
        } else {
            res.status(401).json("Email hoặc mật khẩu không hợp lệ!");
            return;
        }
    }

    //[POST] 
    async sendEmailResetPassword(req, res, next) {
        var result = new ReturnResult();
        try {
            var { email } = req.body;
            if (email) {
                const user = await User.findOne({ email: email });
                if(user) {
                    let token = await Token.findOne({ user: user.id});
                    if (!token) {
                        token = await new Token({
                            user: user,
                            token: crypto.randomBytes(32).toString("hex"),
                        }).save();
                    }
                    const link = `${process.env.FRONT_END_BASE_URL}/auth/reset-password/${user._id}/${token.token}`;
                    await sendEmail(user.email, "Password reset", link);
                }
                result.result = "Yêu cầu thay đổi mật khẩu đã được gửi tới email của bạn.";
            }   
        }
        catch (error) {
            console.log(error);
        }
        res.status(200).json(result);
    }

    // [POST]
    async changePassword(req, res, next){
        var result = new ReturnResult();
        try {
            const user = await User.findById(req.params.userId);
            if(user) {
                const token = await Token.findOne({
                    user: user.id,
                    token: req.params.token,
                });
                if(token) {
                    user.password = await hash(req.body.password, 10); 
                    var updatedUser = await user.save();
                    var removedToken = await Token.deleteOne(token);
                    if(updatedUser && removedToken) {
                        result.result = "Thay đổi mật khẩu thành công!!";
                    }
                }
            }
        }
        catch(error) {
            console.log(error);
        }
        res.status(200).json(result);
    }
}

export default new authController;