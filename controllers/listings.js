const Listing = require("../models/listing");

module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async(req, res, next) => {
    // let {title, description, image, price, country, location} = req.body;
    // let listing = req.body;OR --> OBJECT INSIDE OBJECT
    // let listing = req.body.listing; --> OBJECT
    // console.log(listing);

    try{
        /*
        if(!req.body.listing){ // Suppose, if we sent nothing in the listing through 'Body' in 'Hoppscotch'
            throw new ExpressError(400, "Send valid data for listing!");
        }*/ // INSTEAD OF THIS CONDITION WE CAN USE 'JOI' USED IN 'listingSchema'

        // let result = listingSchema.validate(req.body);
        // // console.log(result);
        // if(result.error){
        //     throw new ExpressError(400, result.error);
        // }

        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user;
        newListing.image = {url, filename};
        await newListing.save();

        req.flash("success", "New listing created!"); // Now, this mssg can be accessed in '/views/layouts/boilerplate.ejs code', so that it can be accessed in either 'Index page', or in 'Show page'

        res.redirect("/listings");
    }catch(err){
        next(err);
    }
};

module.exports.showListing = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate: {path: "author"}}).populate("owner");
    // 'populate({path:"reviews", populate: {path: "author"}})' --> NESTED POPULATE

    if(!listing){
        req.flash("error", "Listing you requested for, does not exist.");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.renderEditForm = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for, does not exist.");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_fill,h_300,w_250"); // Decreasing the pixels(size) of the original image, "h_300--> height:300px; width:250px"

    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async(req, res) => {
    if(!req.body.listing){ // Suppose, if we sent nothing in the listing through 'Body' in 'Hoppscotch'
        throw new ExpressError(400, "Send valid data for listing!");
    }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, {new: true, runValidators: true});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};

        await listing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
