//dependencies
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

const mongoose = require('mongoose');
const routes = require('./routes');


//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//static assets
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}


//MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/googlebooks",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });


//routes
app.use(routes);


//start server
app.listen(PORT, () => {
    console.log(`🌎 ==> API server now on port ${PORT}!`);
});