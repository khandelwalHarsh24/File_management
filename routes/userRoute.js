const express=require('express');
const router=express.Router();


const {getUsers,getUserById,registerUser,loginUser} =require('../controller/userController');

router.route('/getUser').get(getUsers);
router.route('/getUser/:id').get(getUserById);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

module.exports=router;
