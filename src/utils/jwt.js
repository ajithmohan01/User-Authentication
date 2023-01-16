import jwt from "jsonwebtoken"
import crypto from "crypto";

export const hashToken = (token)=>{
  return crypto.createHash('sha512').update(token).digest('hex');
}

export const generateAccessToken =(user)=>{
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '12h',
  });
}

// export const generateRefreshToken=(user)=>{
//   return jwt.sign({
//     id: user.id,
//   }, process.env.JWT_REFRESH_SECRET, {
//     expiresIn: '4h',
//   });
// }

export const generateTokens=(user)=>{
  const accessToken = generateAccessToken(user);
  return {
    accessToken,
  };
}



