import bcrypt from "bcrypt";
import db from "../config/db.js";
import { response } from "../utils/common.js";
import { hashToken } from "../utils/jwt.js";
import { generateTokens } from "../utils/jwt.js";

class AuthServices {
  
  registerUser = async ({ body: userData }, res) => {
    const user = await this.createUser(userData);
    if (user) {
      res.status(201).json(response("success", "User Created Successfully", user));
    } else {
      res.status(409).json(response("failed", "User not created", null));
    }
  };

  loginUser = async ({ body: userData }, res) => {
    const user = await this.findUserByEmail(userData.email);
    if (!user) {
      res
        .status(409)
        .json(response("failed", "Invalide Login credential", null));
    }
    const validPassword = await bcrypt.compare(
      userData.password,
      user.password
    );
    if (!validPassword) {
      res.status(409).json(response("failed", "Invalide Password", null));
    }
    res.status(201).json({
      status: "success",
      message: "User Login Successfully",
      tokens: generateTokens(user),
    });
  };

  //NOT YET CONFIRMED

  // async refreshToken(req, res) {
  //   const token = req.cookies.refreshToken;
  //   if (!token) return res.json({ message: "missing access token" });
  //   const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  //   const user = await this.findUserById(payload.id);
  //   if (!user) return res.json({ message: "no user found" });
  //   const { accessToken, refreshToken } = generateTokens(user);
  //   res.cookie("refreshToken", refreshToken);
  //   res.json({ accessToken });
  // }

  findUserById = (id) => {
    return db.user.findUnique({
      where: {
        id,
      },
    });
  };

  findUserByempid = (empid) => {
    return db.user.findUnique({
      where: {
        empid,
      },
    });
  };

  findUserByusername = (username) => {
    db.user.findUnique({
      where: {
        username,
      },
    });
  };

  findUserByEmail = (email) => {
    return db.user.findUnique({
      where: {
        email: email,
      },
    });
  };

  createUser = (user) => {
    user.password = bcrypt.hashSync(user.password, 12);
    return db.user.create({
      data: user,
    });
  };

  addRefreshTokenToWhitelist = ({ jti, refreshToken, userId }) => {
    return db.refreshToken.create({
      data: {
        id: jti,
        hashedToken: hashToken(refreshToken),
        userId,
      },
    });
  };

  findRefreshTokenById = (id) => {
    return db.refreshToken.findUnique({
      where: {
        id,
      },
    });
  };

  deleteRefreshToken = (id) => {
    return db.refreshToken.update({
      where: {
        id,
      },
      data: {
        revoked: true,
      },
    });
  };

  revokeTokens = (userId) => {
    return db.refreshToken.updateMany({
      where: {
        userId,
      },
      data: {
        revoked: true,
      },
    });
  };
}

export default new AuthServices();
