import jwt from "jsonwebtoken";
import ms from "ms";

export const generateToken = (payload, expiresIn) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn,
    });
    return token;
}

export const generateLoginToken = (userId, res) => {
    const payload = { id: userId };
    const token   = generateToken(payload, process.env.JWT_EXPIRES_IN);
    
    res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: ms(process.env.JWT_EXPIRES_IN),
        secure: process.env.NODE_ENV === "production",
    });

    return token;
}