const express = require("express");
const router = express.Router();

const { register, login, updateProfile, getMe } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.post("/register", register);
router.post("/login", login);

router.put(
    "/profile",
    authMiddleware,
    upload.fields([
        { name: "profilePicture", maxCount: 1 },
        { name: "collegeIdCard", maxCount: 1 }
    ]),
    updateProfile
);

router.get("/me", authMiddleware, getMe);

module.exports = router;