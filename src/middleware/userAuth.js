// import { findUserByEmail, findUserByempid, findUserByusername } from "../services/authServices.js";

import { response } from "../utils/common.js";
import  jwt  from "jsonwebtoken";// export const saveUser = async (req, res, next) => {
//   try {
//     const { username, email, empid } = req.body;
//     const emailCheck = await findUserByEmail(email)
//     if (emailCheck) res.status(409).send("email already taken");
//     const empidCheck = await  findUserByempid(empid)
//     if (empidCheck) res.status(409).send("emp id already taken");
//     const usernameCheck = await findUserByusername(username)
//     if (usernameCheck) res.status(409).send("username already taken"); 
//     next();
//   } catch (error) {
//     console.log(error.message);
//     res.status(400).send(error.message);
//   }
// };

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(409).json(response("failed", "Authentication failed" , null));
    jwt.verify(token,process.env.JWT_ACCESS_SECRET);
    next();
  } catch (error) {
    res.status(500).json(response("server error", error.message, null));
  }
}




