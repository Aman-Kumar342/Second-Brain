import {
    Request,
    Response
} from 'express';
import {
    User
} from "../models/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const signup =async (req: Request, res: Response)=>{
    try{
        const {
            username,
            password
        }=req.body;
        const usernameRegex=/^[a-zA-Z0-9_]{3,10}$/;
        const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
        if(!usernameRegex.test(username) || !passwordRegex.test(password)){
            return res.status(400).json({
                message: "Invalid username or password format."
            });
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                message: "Username already exists."
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            password: hashedPassword
        });
        await user.save();
        res.status(200).json({
            message:"Signed up"
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
        });
    }

};
 const signin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(403).json({ error: "Wrong username or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ error: "Wrong username or password" });
    }
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
export {
    signup,
    signin
};