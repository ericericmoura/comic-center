import jwt from "jsonwebtoken";
import ms from "ms";

export const generateToken = (userId, role, res) => {    
    const payload = {id: userId, role};
    const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.cookie("jwt", token, {
        maxAge: ms(process.env.JWT_EXPIRES_IN),
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"        
    });    
}