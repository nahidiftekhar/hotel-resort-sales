const router = require('express').Router();
const userServices = require('../services/user-services');

//Test routing and DB
router.get('/', userServices.testDb);

//Hash string
router.get('/hash-string/:string', userServices.hashString);

//User signup
router.post('/signup', userServices.addUserPlainText); //tested

//Create user
router.post('/create-user', userServices.addUser);

//Change Password
router.post('/change-password', userServices.changePassword); //tested

//User login
router.post('/login', userServices.loginUser); //tested

//User logout
router.get('/logout', userServices.logoutUser);

//Fetch user types
router.get('/user-types', userServices.fetchUserTypes);

//Change password (user provided password)
router.post('/change-password', userServices.changePassword);

//Reset password (system generated)
router.post('/reset-password', userServices.resetPassword);

module.exports = router;

// //Authorize access
// router.post("/authorize", userServices.authorizeAccess);

// //Resent validation email
// router.get("/resend-validation/:email", userServices.resendValidation);

// //Forgot password
// router.post("/forgot-password", userServices.forgotPassword);
// router.post("/set-password", userServices.setPassword);
// router.get("/reset/:token/:userId", userServices.checkPwToken);
