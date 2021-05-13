const express = require('express');
const app = express();
const port = 4000;

// SETUP Mongoose
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/crudapp';

app.use(express.json())

// Create a function to connect to the db
mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database connection successful");
    }
})

// CREATE SCHEMA
const crudSchema = new mongoose.Schema({
    name: String,
    email: String,
    country: String
})

const Crud = mongoose.model('Crud', crudSchema);

// POST request to /details to create a new detail
app.post('/details', function (req, res) {
    // retrieve new book details from req.body
    Crud.create({
        name: req.body.name,
        email: req.body.email,
        country: req.body.country
    }, (err, newDetails) => {
        if (err) {
            return res.status(500).json({ message: err })
        } else {
            return res.status(200).json({message: "new details created successfully", newDetails})
        }
    })
})

// GET request to /details to fetch all details
app.get('/details', function(req, res) {
    // fetch all books
    Crud.find({}, function(err, details) {
        if (err) {
            return res.status(500).json({message:err})
        } else {
            return res.status(200).json({details})
        }
    })

})

// GET request to /details/:id to fetch a single details
app.get('/details/:id', function(req, res) {
    // fetch one details
    Crud.findById(req.params.id, function(err, detail) {
        if (err) {
            return res.status(500).json({ message:err })
        } 
        else if (!detail) {
            return res.status(404).json({ message: "details not found" })
        } 
        else {
            return res.status(200).json({ detail })
        }
    })

})

// PUT request to /details/:id to update a single details
app.put('/details/:id', function(req, res) {
    // update one details
    Crud.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email
    }, function(err, detail) {
            if (err) {
                return res.status(500).json({ message:err })
            } 
            else if (!detail) {
                return res.status(404).json({ message: "details not found" })
            } 
            else {
                detail.save((err, savedDetails) => {
                    if (err) {
                        return res.status(400).json({ message:err })
                    } 
                    else {
                        return res.status(200).json({ message: "details updated successfully" })
                    }
                })
            }
    })

})

// DELETE request to /details/:id to delete a single details
app.delete('/details/:id', function(req, res) {
    // delete one details
    Crud.findByIdAndDelete(req.params.id, function(err, detail) {
            if (err) {
                return res.status(500).json({ message:err })
            } 
            else if (!detail) {
                return res.status(404).json({ message: "details not found" })
            } 
            else {
                return res.status(200).json({ message: "details deleted successfully" })
            }
    })

})


app.listen(port, () => console.log(`app listening on port ${port}`));