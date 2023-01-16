import express from "express";
import authServices  from "../service/authServices.js";
import { response } from "../utils/common.js";
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    await authServices.registerUser(req, res);
  } catch (error) {
    res.status(500).json(response("server error", error.message, null));
  }
});

router.post("/login", async (req, res) => {
  try {
    await authServices.loginUser(req, res);
  } catch (error) {
    res.status(500).json(response("server error", error.message, null));
  }
});

//  NOT YET CONFORIMED

// router.post("/refreshtoken", async (req, res) => {
//   try {
//     authServices.refreshToken(req, res);
//   } catch (error) {
//     res.json({ error: error.message });
//   }
// });

export default router;
