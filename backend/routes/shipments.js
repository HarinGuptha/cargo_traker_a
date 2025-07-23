const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');

// @route   GET /api/shipments
// @desc    Get all shipments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, containerId, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (containerId) filter.containerId = { $regex: containerId, $options: 'i' };

    const shipments = await Shipment.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Shipment.countDocuments(filter);

    res.json({
      shipments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/shipments/:id
// @desc    Get shipment by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ 
      $or: [
        { _id: req.params.id },
        { shipmentId: req.params.id }
      ]
    });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json(shipment);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/shipments
// @desc    Create a new shipment
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      containerId,
      origin,
      destination,
      cargo,
      carrier,
      estimatedArrival
    } = req.body;

    // Generate unique shipment ID
    const shipmentId = `SH${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const newShipment = new Shipment({
      shipmentId,
      containerId,
      origin,
      destination,
      currentLocation: origin, // Initially at origin
      route: [origin], // Start route with origin
      cargo,
      carrier,
      estimatedArrival: estimatedArrival || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      status: 'pending'
    });

    // Add initial tracking entry
    newShipment.trackingHistory.push({
      location: origin,
      status: 'Shipment created',
      notes: 'Shipment has been created and is pending pickup',
      timestamp: new Date()
    });

    const shipment = await newShipment.save();
    res.status(201).json(shipment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/shipments/:id/update-location
// @desc    Update shipment location
// @access  Public
router.post('/:id/update-location', async (req, res) => {
  try {
    const { location, status, notes } = req.body;

    const shipment = await Shipment.findOne({ 
      $or: [
        { _id: req.params.id },
        { shipmentId: req.params.id }
      ]
    });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // Update current location
    shipment.currentLocation = location;
    
    // Add to route if it's a new location
    const lastRouteLocation = shipment.route[shipment.route.length - 1];
    if (!lastRouteLocation || 
        lastRouteLocation.coordinates.latitude !== location.coordinates.latitude ||
        lastRouteLocation.coordinates.longitude !== location.coordinates.longitude) {
      shipment.route.push(location);
    }

    // Update status if provided
    if (status) {
      shipment.status = status;
    }

    // Add tracking history entry
    shipment.trackingHistory.push({
      location,
      status: status || 'Location updated',
      notes: notes || 'Location has been updated',
      timestamp: new Date()
    });

    // Recalculate ETA
    shipment.estimatedArrival = shipment.calculateETA();

    await shipment.save();
    res.json(shipment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/shipments/:id/eta
// @desc    Get estimated time of arrival
// @access  Public
router.get('/:id/eta', async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ 
      $or: [
        { _id: req.params.id },
        { shipmentId: req.params.id }
      ]
    });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    const eta = shipment.calculateETA();
    const distance = shipment.calculateDistance(
      shipment.currentLocation.coordinates,
      shipment.destination.coordinates
    );

    res.json({
      estimatedArrival: eta,
      currentETA: shipment.estimatedArrival,
      distanceRemaining: Math.round(distance),
      currentLocation: shipment.currentLocation,
      destination: shipment.destination
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/shipments/:id
// @desc    Update shipment details
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findOneAndUpdate(
      { 
        $or: [
          { _id: req.params.id },
          { shipmentId: req.params.id }
        ]
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json(shipment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/shipments/:id
// @desc    Delete shipment
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findOneAndDelete({ 
      $or: [
        { _id: req.params.id },
        { shipmentId: req.params.id }
      ]
    });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json({ message: 'Shipment deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
