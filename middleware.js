const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError =  require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user); // this 'req.user' triggers 'req.isAuthenticated()' to check if the user is Authenticated or not
    if(!req.isAuthenticated()){
        // So that the session save the URL for the page  that the user wanted to go to
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl; // we do this, since value 'req.locals' is accessible everywhere
    }
    next();
};

module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not an authorized user of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next(); // Don't forget it please, coz its a middleware, so without completing the desired operation, it will be stuck in the middle
};

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);

    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not an authorized user to delete this review!");
        return res.redirect(`/listings/${id}`);
    }
    next(); // Don't forget it please, coz its a middleware, so without completing the desired operation, it will be stuck in the middle
};
