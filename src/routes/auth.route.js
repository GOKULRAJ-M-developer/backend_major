import express from 'express';
import  authcontroller  from '../controllers/user.auth.controller.js';
const router = express.Router();

router.post('/register',authcontroller.userRegisterController);
router.post('/login',authcontroller.userLoginController);

export default router;