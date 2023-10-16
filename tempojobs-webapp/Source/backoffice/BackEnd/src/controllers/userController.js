import { constants } from "../../constants.js";
import { ReturnResult } from "../DTO/returnResult.js";
import User from "../models/userModel.js";
import UserDetail from "../models/userDetailModel.js"

class userController {
    // [GET] /get
    async get(req, res, next) {
        const data = await User.find({});
        //compare password with hashedpassword
        if(data) {
            res.status(200).json({data});
        } else {
            res.status(401).json("Email or password is not valid");
            return;
        }
    }

    async getUserDetailById(req, res, next) {
        var result = new ReturnResult();
        try {
            const userId = req.query.id;
            const user = await User.findById(userId, '-_id userDetail').lean().exec();
            const userDetail = await UserDetail.findById(user.userDetail);
            if(userDetail) {
                result.result = userDetail;
            } else {
                result.message = "No user detail found";
            }
        }
        catch(ex) {
            console.log(ex);
            result.message = constants.TECHNICAL_ERROR;
        }
        res.status(200).json(result);
    }

    async saveUserDetail(req, res, next) {
        var result = new ReturnResult();
        try {
            const userDetail = req.body;
            let updatedUserDetail = await UserDetail.findByIdAndUpdate(userDetail._id, userDetail, {returnOriginal: false});
            if(updatedUserDetail) result.result = updatedUserDetail;
        }
        catch (error) { 
            console.log(error);
        }
        res.status(200).json(result);
    }
}

export default new userController;