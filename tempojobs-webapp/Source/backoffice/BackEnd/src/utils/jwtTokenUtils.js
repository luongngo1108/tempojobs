import jwt from 'jsonwebtoken';

const createToken = (user) => 
    jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + (60*60*10),
            user, 
        },
        process.env.ACCESS_TOKEN_SECRET, 
        { algorithm: 'HS512' })

export {
    createToken
}