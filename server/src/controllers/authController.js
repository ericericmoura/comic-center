import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../config/database.js"
import { isPasswordStrong } from "../utils/passwordUtils.js";
import { Role } from "../generated/prisma/enums.ts";
import { generateToken, generateLoginToken } from "../utils/generateToken.js";
import { sendEmailConfirmation, sendPasswordRecoveryEmail } from "../utils/sendEmail.js";

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
    generateLoginToken(user.id, user.role, res);

    await sendEmailConfirmation(user.email);

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

  const password_hash   = user.password_hash; 
  const isPasswordValid = await bcrypt.compare(password, password_hash);
  if (!isPasswordValid)
  {
    return res.status(401).json({ error: "Invalid e-mail or password." });
  }

  generateLoginToken(user.id, user.role, res);

  res.status(200).json({message: "You are now logged in."})
};

const logout   = async (req, res) => { 
  res.cookie("jwt", "", {maxAge: new Date(0), httpOnly: true});

  res.status(200).json({message: "Successfully logged out."});
};

const resendConfirmationEmail = async (req, res) => {
  const {email} = req.body;  

  const user = await prisma.users.findUnique({where: {email}});
  if (!user)
  {
    return res.status(404).json({error: "user not found."});
  }
  if (user.confirmed_email)
  {
    return res.status(400).json({error: "user's e-mail is already confirmed."});
  }  
  await sendEmailConfirmation(email);

  res.status(200).json({message: "Confirmation e-mail sent."});
};

const confirmEmail = async (req, res) => {
  const decoded = jwt.decode(req.params.token, process.env.JWT_SECRET);
  if (!decoded || !decoded.email)
  {
    return res.status(400).json({error: "Invalid or expired token."});
  }

  const userExists = await prisma.users.findUnique({where: {email: decoded.email}});
  if (!userExists)
  {
    return res.status(404).json({ error: "E-mail not found." });
  }

  await prisma.users.update({where: {email: decoded.email}, data: {confirmed_email: true}});

  res.status(200).json({ message: "success: e-mail confirmed." });
};

const forgotPassword = async (req, res) => {
  const {email} = req.body;
  const userExists = await prisma.users.findUnique({
    where: { email },
  });
  if (!userExists) {
    return res.status(404).json({ error: "User not found." });
  }
  await sendPasswordRecoveryEmail(email);  
  res.status(200).json({message: "password recovery email sent."});
};

const resetPasswordForm = async (req, res) => {  
  const {token} = req.params;
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  if (!decoded || !decoded.email)
  {
    return res.status(400).json({error: "Invalid token."});
  }

  const user = await prisma.users.findUnique({where: {email: decoded.email}});
  if (!user)
  {
    return res.status(404).json({error: "user not found."});
  }

  res.body = {token};

  return res
    .status(200)
    .send(
      `<form method="post" action="/authentication/reset-password">
        <input type="hidden" name="token" value="${token}">
        <input type="password" name="password" required>
        <input type="submit" value="Reset Password">
      </form>`,
    );
};

const resetPassword = async (req, res) => {
  const {token, password} = req.body;

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  if (!decoded || !decoded.email) {
    return res.status(400).json({ error: "Invalid token." });
  }

  const userExists = await prisma.users.findUnique({ where: { email: decoded.email } });
  if (!userExists) {
    return res.status(404).json({ error: "user not found." });
  }

  const salt         = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  
  await prisma.users.update({where: {email: decoded.email}, data: {password_hash: passwordHash}});

  res.status(200).json({message: "Successfully updated password"});
}

export {
  register,
  login,
  logout,
  resendConfirmationEmail,
  confirmEmail,
  forgotPassword,
  resetPasswordForm,
  resetPassword
};
