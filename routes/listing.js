const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError =  require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });


/* '/listings routes' */


router.route("/")
// Index Route
.get(wrapAsync(listingController.index)) // this 'index' callback is defined in '../controllers/listings.js'
// Create Route
.post(isLoggedIn, validateListing, upload.single("listing[image]"), listingController.createListing);
// .post(upload.single("listing[image]"), (req, res) => {
//     res.send(req.file);
// })


// Always keep '/listings/new' , etc before '/listings/:id' with "get request"
// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
// Show Route
.get(wrapAsync(listingController.showListing))
// Update Route
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
// Delete Route
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
