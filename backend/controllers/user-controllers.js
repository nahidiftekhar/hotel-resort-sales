const router = require("express").Router();
const userServices = require("../services/user-services");

//Test routing and DB
router.get("/", userServices.testDb);

//User signup
router.post("/signup", userServices.addUserPlainText); //tested

//Change Password
router.post("/change-password", userServices.changePassword); //tested

//User login
router.post("/login", userServices.loginUser); //tested

//User logout
router.get("/logout", userServices.logoutUser);

// //Authorize access
// router.post("/authorize", userServices.authorizeAccess);

// //Resent validation email
// router.get("/resend-validation/:email", userServices.resendValidation);

// //Forgot password
// router.post("/forgot-password", userServices.forgotPassword);
// router.post("/set-password", userServices.setPassword);
// router.get("/reset/:token/:userId", userServices.checkPwToken);

module.exports = router;
