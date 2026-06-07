if(process.env.NODE_ENV != "production"){ // i.e. if we're in development environment, then only load the .env file
    require('dotenv').config();
}

/*
console.log("NODE_ENV =", process.env.NODE_ENV);
console.log("DB_URL =", process.env.ATLASDB_URL);
console.log("SECRET =", process.env.SECRET);

console.log("SECRET =", process.env.SECRET);
console.log("Type =", typeof process.env.SECRET);
*/

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError =  require("./utils/ExpressError.js");
// const {listingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;
const secret = process.env.SECRET;

const port = 3000; // for local development
// const port = process.env.PORT || 3000; // for deployment on Heroku

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}


app.engine('ejs', ejsMate);

app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, "/public")));

// app.get("/", (req, res) => {
//     res.send("working...");
// });

/*
console.log("dbUrl =", dbUrl);
console.log("SECRET =", process.env.SECRET);
*/

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600, // to update our session details after the given time-period (in seconds)
});

// To check if there are any errors in our MongoDB session store
store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
})

const sessionOptions = {
    store, // MongoStore related info. going to mongo sessions collection in our database
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next(); // DON'T FORGET TO CALL next() , else we'll be stuck in this middleware itself
});

/* Demo User */
// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "Delta_Student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloWorld");
//     res.send(registeredUser);
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



// app.get("/testListing", async(req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "Mesmerising mountain views",
//         price: 1500,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("successful testing");
// });


// Handling a specific Error:- e.g. - Page not found!
// Catch-all for undefined routes
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {err} );
    // res.status(statusCode).send(message);
});

/*
// Error Handling Middleware
app.use((err, req, res, next) => {
    res.send("<h3>Something went wrong!</h3>") 
});
*/

app.listen(port, () => {
    console.log(`Server listening to port: ${port}`);
});
