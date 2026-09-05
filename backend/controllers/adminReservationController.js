const Reservation = require('../models/Reservation');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/apiResponse');

exports.getAllReservations = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { reservationNumber: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const reservations = await Reservation.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Reservation.countDocuments(filter);

    return res.status(200).json(successResponse({
      reservations,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    }));
  } catch (error) {
    next(error);
  }
};

exports.updateReservationStatus = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return next(new AppError('Reservation not found', 404));

    if (req.body.status) reservation.status = req.body.status;
    if (req.body.adminNotes !== undefined) reservation.adminNotes = req.body.adminNotes;

    await reservation.save();

    return res.status(200).json(successResponse(reservation, 'Reservation updated successfully'));
  } catch (error) {
    next(error);
  }
};
