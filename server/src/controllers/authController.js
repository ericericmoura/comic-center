import bcrypt from "bcrypt"
import { prisma } from "../config/database.js"
import { isPasswordStrong } from "../utils/passwordUtils.js";
import { Role } from "../generated/prisma/enums.ts";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => { 
    const {fullname, username, email, password, date_of_birth} = req.body;
    
    // Check if user e-mail is unique
    const userExists = await prisma.users.findUnique({
      where: { email: email },
    });
    if (userExists)
    {
        return res.status(400).json({error: "A user with that e-mail already exists in the database."});
    }

    // Create password hash
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);    

    // Insert user
    const user = await prisma.users.create({data: {
        fullname,
        username,
        email,
        password_hash,
        date_of_birth,
        role: Role.USER
    }});

    // Generate JWT token
    generateToken(user.id, user.role, res);

    const data = {
      id: user.id,
      fullname,
      username,
      email,
      date_of_birth,
      role: user.role
    };

    res.status(201).json({status: "success", data});
};

const login    = async (req, res) => { res.status(500).json({message: "Not implemented."})};
const logout   = async (req, res) => { res.status(500).json({message: "Not implemented."})};

export {register, login, logout};