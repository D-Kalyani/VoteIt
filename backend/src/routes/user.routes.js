import {Router} from 'express';
import { signup , login ,getCurrentUser,refreshAccessToken,logoutUser} from '../controllers/user.controller.js';
import {verifyJwt} from '../middleware/verifyJwt.js'


const router = Router()

router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/current-user").get(verifyJwt , getCurrentUser)
router.route("/refresh-access-token").post(refreshAccessToken)
router.route("/logout").get(verifyJwt , logoutUser)


export default router