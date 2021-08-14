const express = require("express");
const router = express.Router();
const { authUser, createUser, userLogin, getUserFilterList } = require('../handlers/userHandler');
const auth = require('../middleware/auth');

//add user
router.put("/create", createUser);
//login user
router.post("/login", userLogin);
//get user from token using jwt
router.get("/auth", auth, authUser);
//get orders or products filtered
router.get('/getFilterList/:list/:value', auth, getUserFilterList)

module.exports = router;