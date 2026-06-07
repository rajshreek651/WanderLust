const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async(req, res) => {
    try{
        let {email, username, password} = req.body;
        const newUser = new User({email, username}); // insted of writing "{email: email, username: username}", simply we write "{email, username}"
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, ((err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        }));
    }catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // matlab, agar 'res.locals.redirectUrl' exist karta hai to use store kara do, else "/listings" ko store kara do "redirectUrl" mein. [Aisa isiliye qki, agar user directly home page se login karta hai to 'res.locals.redirect' to 'undefined' hoga aur ye niche ka conditions ny lgaya gya to "page not found! error will appear"]
    res.redirect(redirectUrl); // So that user gets the same page after login , which he wanted to go to
};

module.exports.logout = (req, res, next) => {
    req.logout( (err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out now!");
        res.redirect("/listings");
    })
};
