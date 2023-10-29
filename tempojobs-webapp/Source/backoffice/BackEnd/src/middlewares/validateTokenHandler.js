import jwt from 'jsonwebtoken';
import { Admin, User } from './roles.js';

const validateToken = async(req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err){
                res.status(401).json(err);
                return;
            }
            req.user = decoded.user;
            return next();
        });

        if(!token) {
            res.status(401).json("User is not authorized or token is missing on the request");
            return;
        }
    }
};

const checkAdminRole = async(req, res, next) => {
    // validateToken(req, res, next);
    const {role} = req.user;
    if(role !== Admin) {
        res.status(403).json("Forbidden!!!");
        return;
    }
    return next();
}

const checkUserRole = async(req, res, next) => {
    // validateToken(req, res, next);
    const {role} = req.user;
    if(role !== User) {
        res.status(403).json("Forbidden!!!");
        return;
    }
    return next();
}

export {
    validateToken,
    checkAdminRole,
    checkUserRole
};