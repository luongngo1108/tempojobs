import { constants } from "../../constants.js";
import { ReturnResult } from "../DTO/returnResult.js";
import User from "../models/userModel.js";
import UserDetail from "../models/userDetailModel.js"
import { hash } from 'bcrypt';
import GoogleMapLocation from "../models/googleMapLocationModel.js";

class userController {
    // [GET] /get
    async get(req, res, next) {
        const data = await User.find({});
        if (data) {
            res.status(200).json({ data });
        } else {
            res.status(401).json("Null");
            return;
        }
    }

    async getAllUserDetail(req, res, next) {
        const email = req.query.email;
        const data = await UserDetail.find({email : {$ne: email}});
        for (var detail of data) {
            const user = await User.findOne({ email: detail.email });
            detail.role = user.role;
            if (detail.googleLocation) {
                detail.googleLocation = await GoogleMapLocation.findById(detail.googleLocation);
            }
        }
        if (data) {
            res.status(200).json({ data });
        } else {
            res.status(401).json("Null");
            return;
        }
    }

    async getAllUserExceptEmailAndAdmin(req, res, next) {
        const email = req.query.email;
        const data = await User.find({email : {$ne: email}, role: {$ne: 'Admin'}});
        if (data) {
            res.status(200).json({ data });
        } else {
            res.status(401).json("Null");
            return;
        }
    }

    async getUserDetailByUserId(req, res, next) {
        var result = new ReturnResult();
        try {
            let userId = req.query.id;
            if(userId) {             
                const user = await User.findById(userId, '-_id userDetail').lean().exec();
                if(user) {
                    const userDetail = await UserDetail.findById(user.userDetail);
                    const googleLocation = await GoogleMapLocation.findById(userDetail.googleLocation);
                    if (googleLocation) userDetail.googleLocation = googleLocation
                    if (userDetail) {
                        result.result = userDetail;
                    } else {
                        result.message = "No user detail found";
                    }
                }
            }
        }
        catch (ex) {
            console.log(ex);
            result.message = constants.TECHNICAL_ERROR;
        }
        res.status(200).json(result);
    }

    async getUserByUserId(req, res, next) {
        var result = new ReturnResult();
        try {
            let userId = req.query.id;
            if(userId) {             
                const user = await User.findById(userId);
                if(user) {
                    result.result = user;
                }
            }
        }
        catch (ex) {
            console.log(ex);
            result.message = constants.TECHNICAL_ERROR;
        }
        res.status(200).json(result);
    }

    async getUserByUserDetailId(req, res, next) {
        var result = new ReturnResult();
        try {
            let userDetailId = req.query.id;
            if(userDetailId) {             
                const user = await User.findOne({userDetail: userDetailId});
                if(user) {
                    result.result = user;
                }
            }
        }
        catch (ex) {
            console.log(ex);
            result.message = constants.TECHNICAL_ERROR;
        }
        res.status(200).json(result);
    }

    async getUserById(req, res, next) {
        var result = new ReturnResult();
        try {
            const userId = req.query.id;
            const user = await User.findOne({ _id: userId });
            if(user) {
                result.result = user;
            } else {
                result.message = "No user found";
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
            let updatedUserDetail = await UserDetail.findByIdAndUpdate(userDetail._id, userDetail, { returnOriginal: false });
            if (updatedUserDetail) {
                result.result = updatedUserDetail;
                var displayNameUser = `${updatedUserDetail.firstName} ${updatedUserDetail.lastName}`
                if (userDetail?.password) {
                    const hashedPassword = await hash(userDetail.password, 10);
                    const user = await User.findOneAndUpdate({ userDetail: updatedUserDetail }, { displayName: displayNameUser, password: hashedPassword });
                }
                else {
                    const user = await User.findOneAndUpdate({ userDetail: updatedUserDetail }, { displayName: displayNameUser });
                }

                if(userDetail.role) {
                    const user = await User.findOneAndUpdate({ userDetail: updatedUserDetail }, { role: updatedUserDetail.role });
                }
                if(userDetail.address) {
                    var userDetailFind = await UserDetail.findById(userDetail._id)
                    const ggMap = await GoogleMapLocation.findByIdAndUpdate(userDetailFind.googleLocation, {address: userDetail.address})
                }
            } else {
                const userAvailable = await User.findOne({ email: userDetail.email });
                if (!userAvailable && userDetail.password) {
                    //Hash password
                    const hashedPassword = await hash(userDetail.password, 10);
                    const googleLocation = await GoogleMapLocation.create({});
                    const ggMap = await GoogleMapLocation.findByIdAndUpdate(googleLocation._id, {address: userDetail.address})
                    const userDetailCreated = await UserDetail.create({
                        firstName: userDetail.firstName,
                        lastName: userDetail.lastName,
                        description: userDetail.description,
                        phone: userDetail.phone,
                        sex: userDetail.sex,
                        role: userDetail.role,
                        birth: userDetail.birth,
                        facebook: userDetail.facebook,
                        instagram: userDetail.instagram,
                        googleLocation: ggMap,
                        email: userDetail.email
                    })

                    const user = await User.create({
                        displayName: userDetail.firstName + " " + userDetail.lastName,
                        email:  userDetail.email,
                        password: hashedPassword,
                        userDetail: userDetailCreated,
                        role: userDetail.role
                    });

                    if(user && userDetail) result.result = userDetail;
                } else {
                    if(userAvailable) result.message = 'Email đã tồn tại!';
                    if(!userDetail.password) result.message = 'Chưa nhập mật khẩu!';
                }
            }
        }
        catch (error) {
            console.log(error);
        }
        res.status(200).json(result);
    }

    async onDeletes(req, res, next) {
        var result = new ReturnResult();
        try {
            const emails = req.body;
            if(emails || emails?.length > 0) {
                for(var email of emails) {
                    await User.findOneAndRemove({email});
                    var removedUserDetail = await UserDetail.findOneAndRemove({email});
                    if(removedUserDetail?.googleLocation) await GoogleMapLocation.findByIdAndRemove(removedUserDetail.googleLocation);
                }
                result.result = true;
            }
        }
        catch (ex) {
            console.log(ex);
            result.message = constants.TECHNICAL_ERROR;
        }
        res.status(200).json(result);
    }

    async getUserByRole(req, res, next) {
        var result = new ReturnResult();
        try {
            const {role} = req.body;
            if(role) {
                var users = await User.find({role: role});  
                result.result = users;
            }
        }
        catch (ex) {
            console.log(ex);
            result.message = constants.TECHNICAL_ERROR;
        }
        res.status(200).json(result);
    }

    async evaluationUser(req, res, next) {
        var result = new ReturnResult();
        try {
            const userId = req.query.userId;
            const evaluate = req.query.evaluate;
            if(userId && evaluate) {
                var user = await User.findOne({_id: userId});
                if (user) {
                    var saveEvaluation = await UserDetail.updateOne(
                        {_id: user.userDetail},
                        {$push: {evaluation: evaluate}}
                    );
                    if (saveEvaluation) {
                        result.result = true;
                    }
                } else {
                    result.message = "User không tồn tại";
                }
            } else {
                result.message = "Bạn cần đưa dữ liệu đánh giá";
            }
        }
        catch (ex) {
            console.log(ex);
            result.message = constants.TECHNICAL_ERROR;
        }
        res.status(200).json(result);
    }
}

export default new userController;