const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;

/**
 * Get locations list
 */
router.get('/', function(request, response) {
    const db = request.db;
    const collection = db.get('locations');
    collection.find({},{},function(error, results){
        response.json(results);
    });
});

/**
 * Get location by id
 */
router.get('/:locationId', function(request, response) {
    const db = request.db;
    const collection = db.get('locations');
    const locationId = request.params.locationId;

    collection.findOne({"_id": new ObjectID(locationId)}, function(error, result) {
        if (error) {
            response.status(500).send({ message: 'There was a problem with getting the information from the database:' + error });
        } else {
            response.json(result);
        }
    });
});


/**
 * Add new location
 */
router.post('/', function(request, response) {
    const db = request.db;
    const collection = db.get('locations');
    const location = {
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
        website: request.body.website,
    };

    collection.insert(location, function (error, result) {
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
    const db = request.db;
    const collection = db.get('locations');
    const locationId = request.params.locationId;
    const location = {
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
        website: request.body.website,
    };

    collection.update({_id: locationId}, location, function (error, result) {
        if (error) {
            response.status(500).send({ message: 'There was a problem with adding the object to the database: ' + error });
        } else {
            response.json({
                message: 'Location was successfully updated',
                result: result
            });
        }
    });
});

/**
 * Delete location
 */
router.delete('/:locationId', function(request, response) {
    const db = request.db;
    const collection = db.get('locations');
    const locationId = request.params.locationId;

    collection.remove({"_id": new ObjectID(locationId)}, function(error, result) {
        if (error) {
            response.status(500).send({ message: 'There was a problem with removing the object from the database: ' + error });
        } else {
            response.send({
                message: 'Object was successfully removed',
                result: result
            });
        }
    });
});

module.exports = router;