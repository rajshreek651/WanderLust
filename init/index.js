const mongoose = require("mongoose");
const initData = require("./sampleData.js");
const Listing = require("../models/listing.js") // If we give just 'one dot' here then it will search "models folder" in this 'init folder', so to make it search "models folder" in the 'parent folder of init folder' we must give 'two dots'
// ../../../req_filename --> way to go back to the required directory and then access the required file


main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


const initDB = async () => { // async func. to initialize the DB
    await Listing.deleteMany({}); // To delete all the existing data

    // 'initData' Ka 'data' Array ka har ek obj ko hum ek new obj mein badal rhe hain jo ki ek same obj. hi hai pr with a new added property 'owner'
    initData.data = initData.data.map((obj) => ({...obj, owner: "6876130ad73193c87b9567ee"}));
    // 'initData.data.map((obj) => ({...obj, owner: "6876130ad73193c87b9567ee"}));' is stored in the same variable "initData.data" , coz 'map() of array' does NOT changes the original array rather returns a 'new array'
    // After doing this task we again need to initialize the DB, so again run /init/index.js in Terminal

    // Then initialize the new fresh data
    await Listing.insertMany(initData.data); // here, 'initData' is an 'Object' which has a property called 'data' which is an 'Array of objects'
    console.log("Data was initialized.");
}

initDB();