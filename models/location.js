const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = Schema({
    name: {type: String},
    type: {type: String},
    latitude: {type: Number},
    longitude: {type: Number},
    description: {type: String},
    street: {type: String},
    zip: {type: String},
    city: {type: String},
    phone: {type: String},
    email: {type: String},
    website: {type: String}
});

const Location = mongoose.model('Location', LocationSchema);

exports.LocationModel = Location;