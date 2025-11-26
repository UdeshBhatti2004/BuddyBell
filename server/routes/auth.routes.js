import { Router } from "express";
import { loginUser, logoutUser, onBoarding, registerUser } from "../controllers/auth-controller.js";
import {protectedRoute} from "../middleware/authMiddleware.js"

const router = Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/logout',logoutUser);
router.post('/onboarding',protectedRoute,onBoarding);

//Check user is logged in
router.get('/me',protectedRoute,(req,res)=>{
    res.status(200).json({
        success : true,
        user : req.user
    })
});


export default router;