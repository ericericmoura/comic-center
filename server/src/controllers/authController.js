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

const login = async (req, res) => { 
  const {email, password} = req.body;

  const user = await prisma.users.findUnique({where: {email}});
  if (!user)
  {
    return res.status(401).json({ error: "Invalid e-mail or password." });
  }

  const password_hash = user.password_hash; 
  const isPasswordValid = await bcrypt.compare(password, password_hash);
  if (!isPasswordValid)
  {
    return res.status(401).json({ error: "Invalid e-mail or password." });
  }

  generateToken(user.id, user.role, res);

  res.status(200).json({message: "You are now logged in."})
};

const logout   = async (req, res) => { res.status(500).json({message: "Not implemented."})};

export {register, login, logout};