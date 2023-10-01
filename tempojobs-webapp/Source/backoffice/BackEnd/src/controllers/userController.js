import User from "../models/userModel.js";

class userController {
    // [GET] /get
    async get(req, res, next) {
        const data = await User.find({});
        console.log(req);
        //compare password with hashedpassword
        if(data) {
            res.status(200).json({data});
        } else {
            res.status(401).json("Email or password is not valid");
            return;
        }
    }
}

export default new userController;