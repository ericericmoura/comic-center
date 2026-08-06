import jwt from "jsonwebtoken"
import { prisma } from "../config/database.js";
import { validateRole } from "../utils/validateRole.js";

export const authMiddleware = (requiredRole, requireConfirmedEmail = true) => {
    return async (req, res, next) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
        {
            token = req.headers.authorization.split(" ")[1];
        } 
        else if (req.cookies?.jwt) 
        {
            token = req.cookies.jwt;
        }
        if (!token)
        {
            return res.status(401).json({error: "Not authorized. No token provided."})
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded.role || !decoded.id)
            {
                return res
                  .status(401)
                  .json({ error: "Not authorized." });
            }
            
            if (!validateRole(requiredRole, decoded.role)) {
              return res
                .status(403)
                .json({ error: "Not allowed to access this endpoint." });
            }
            const userExists = await prisma.users.findUnique({where: {id: decoded.id}});
            if (!userExists)        
            {
                return res
                    .status(404)
                    .json({ error: "Account no longer exists." });
            }
            if (requireConfirmedEmail && !userExists.confirmed_email)
            {
                return res
                  .status(401)
                  .json({ error: "Confirm your e-mail adress to use this route." });
            }
            req.auth = {
                role: decoded.role,
                id: decoded.id,
            };
            next();
        } catch (error) {
            return res.status(401).json({ error: "Not authorized." });
        }
}};