const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Location = mongoose.model('Location');

/**
 * Get locations list
 */
router.get('/', function(request, response) {
    Location.find({}, function (error, docs) {
        if (error) {
            response.status(500).send({ message: 'There was a problem with getting the locations from the database:' + error });
        } else {
            response.json(docs);
        }
    });
});

/**
 * Get location by id
 */
router.get('/:locationId', function(request, response) {
    const locationId = request.params.locationId;

    Location.findById(locationId, function(error, doc) {
        if (error) {
            response.status(500).send({ message: 'There was a problem with getting the information from the database:' + error });
        } else {
            response.json(doc);
        }
    });
});

/**
 * Add new location
 */
router.post('/', function(request, response) {
    const location = new Location({
        name: request.body.name,
        type: request.body.type,
        latitude: request.body.latitude,
        longitude: request.body.longitude,
        description: request.body.description,
        street: request.body.street,
        zip: request.body.zip,
        city: request.body.city,
        phone: request.body.phone,
        email: request.body.email,
        website: request.body.website
    });

    location.save(function (error, result) {
        if (error) {
            response.status(500).send({ message: 'There was a problem with adding the object to the database: ' + error });
        } else {
            response.json({
                message: 'Location was added successfully to database',
                result: result
            });
        }
    });
});


/**
 * Update location
 */
router.put('/:locationId', function(request, response) {
    const updateData = {
        name: request.body.name,
        type: request.body.type,
        latitude: request.body.latitude,
        longitude: request.body.longitude,
        description: request.body.description,
        street: request.body.street,
        zip: request.body.zip,
        city: request.body.city,
        phone: request.body.phone,
        email: request.body.email,
        website: request.body.website
    };

    const query = {'_id':request.params.locationId};

    Location.findOneAndUpdate(query, updateData, {upsert:true}, function(error, doc){
        if (error) {
            response.status(500).send({ message: 'There was a problem with adding the object to the database: ' + error });
        } else {
            response.json({
                message: 'Location was successfully updated',
                result: doc
            });
        }
    });
});

/**
 * Delete location
 */
router.delete('/:locationId', function(request, response) {
    Location.findByIdAndRemove(request.params.locationId, function(error) {
        if (error) {
            response.status(500).send({ message: 'There was a problem with removing the object from the database: ' + error });
        } else {
            response.send({
                message: 'Location was successfully removed'
            });
        }
    });
});

module.exports = router;