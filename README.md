# Wanderlust
A full-stack travel website, for travel and accomodation.

Link to website:
https://wanderlust-2tzj.onrender.com/listings


# Development Phase:
WANDERLUST
___________

app.js
___________

const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Importing the models
const Listing = require('./models/listing');

const port = 3000;

// Connecting to MongoDB
const MONGO_URL ='mongodb://localhost:27017/wanderlust2';

// CHECK CONNECTION TO DB
main().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

// Creating API(routes) Endpoints
app.get('/', (req, res) => {
    res.send('Hi, I am root'); // will be sent to homepage: http://localhost:3000/
})

/*
// TESTING API ENDPOINT TO CHECK IF THE LISTING MODEL IS WORKING PROPERLY AND CAN SAVE A SAMPLE LISTING TO THE DATABASE, THIS ENDPOINT CAN BE DELETED LATER ONCE TESTING IS SUCCESSFUL
app.get('/testlistings', async(req, res) => {
    let sampleListing = new Listing({
        title: 'Beautiful Beach House',
        description: 'A stunning beach house with ocean views and modern amenities.',
        price: 1250,
        location: 'Maui, Hawaii',
        country: 'USA',
    })

    await sampleListing.save(); // This will actually create the database when listing model is used for the first time and will save the sample listing to the database
    console.log('Sample listing saved to the database');
    res.send('SUCCESSFUL TESTING'); // will be sent to http://localhost:3000/testlistings
});
*/

// INDEX ROUTE: TO GET ALL THE LISTINGS FROM THE DATABASE
app.get('/listings', (req, res) => {
    Listing.find().then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.error('Error fetching listings:', err);
        res.status(500).send('Error fetching listings');
    });
});
    
// Starting the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
______________________________________________________________________________________________________

./models/listing.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creating a schema for the listing collection in MongoDB
const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String, // imp. for deleting or updating the image from cloudinary when the listing is deleted or updated
        url: {
        type: String,
        default: 'https://media.gettyimages.com/id/168301497/photo/luxurious-hawaiian-5-star-resort.jpg?s=612x612&w=0&k=20&c=-xiwadofhhsgARGhxNPB6L8MbnQ1HRVhbyOKdQZyRtc=', // Default value for image if user does not provide one
        set: (value) => value === '' ? 'https://media.gettyimages.com/id/168301497/photo/luxurious-hawaiian-5-star-resort.jpg?s=612x612&w=0&k=20&c=-xiwadofhhsgARGhxNPB6L8MbnQ1HRVhbyOKdQZyRtc=' : value, // CHECK IF USER ENTERED A VALID IMAGE URL AS 'VALUE' IN 'image', If not a valid URL for image then set a DEFAULT PLACEHOLDER IMAGE
        },
    },
    price: Number,
    location: String,
    country: String,
});

// Creating a model for the Listing Schema
const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing; 
___________________________________________________________________________________________________________________________________________________________________

CONTINUED IN CODE ...
