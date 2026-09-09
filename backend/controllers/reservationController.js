import { Reservation } from '../models/Reservation.js';
import { getNextSequence } from '../models/Counter.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { emitNewReservation } from '../sockets/orderSocket.js';
import { sendReservationConfirmationEmail } from '../services/emailService.js';

export const createReservation = async (req, res, next) => {
  try {
    const { fullName, phone, email, date, time, guests, seatingArea, specialRequest } = req.body;

    // Check potential duplicate booking for same person at same slot
    const existing = await Reservation.findOne({
      email: email.toLowerCase(),
      date,
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existing) {
      return sendError(res, 400, 'A reservation under this email already exists for the selected date and time slot.');
    }

    // Capacity check: check total guests booked for this time & area
    const totalBooked = await Reservation.aggregate([
      { $match: { date, time, seatingArea, status: { $in: ['pending', 'confirmed'] } } },
      { $group: { _id: null, totalGuests: { $sum: '$guests' } } }
    ]);

    const currentGuests = totalBooked[0]?.totalGuests || 0;
    const maxCapacityPerSlot = 35; // Maximum capacity per slot per seating area

    if (currentGuests + Number(guests) > maxCapacityPerSlot) {
      return sendError(res, 400, `Sorry, the ${seatingArea} has reached maximum occupancy for ${time} on ${date}. Please select another time or seating atmosphere.`);
    }

    const seq = await getNextSequence('reservationNumber', 805);
    const reservationNumber = `RES-${seq}`;

    const reservation = await Reservation.create({
      reservationNumber,
      user: req.user?._id || null,
      fullName,
      phone,
      email: email.toLowerCase(),
      date,
      time,
      guests: Number(guests),
      seatingArea: seatingArea || 'Indoor Family Hall',
      specialRequest: specialRequest || '',
      status: 'pending'
    });

    // Real-time notification & Email
    emitNewReservation(reservation);
    sendReservationConfirmationEmail(reservation).catch(() => {});

    return sendSuccess(res, 201, 'Table reservation submitted successfully', reservation);
  } catch (error) {
    next(error);
  }
};

export const getMyReservations = async (req, res, next) => {
  try {
    const query = {
      $or: [
        { user: req.user._id },
        { email: req.user.email.toLowerCase() },
        { phone: req.user.phone }
      ]
    };

    const reservations = await Reservation.find(query).sort({ date: -1, time: -1 });
    return sendSuccess(res, 200, 'Reservations retrieved', reservations);
  } catch (error) {
    next(error);
  }
};

export const getReservationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let reservation = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      reservation = await Reservation.findById(id);
    }
    if (!reservation) {
      reservation = await Reservation.findOne({ reservationNumber: id.toUpperCase() });
    }

    if (!reservation) {
      return sendError(res, 404, 'Reservation not found.');
    }

    const isAdmin = req.user && ['admin', 'superadmin', 'staff'].includes(req.user.role);
    if (!isAdmin) {
      const isOwner =
        (req.user && reservation.user && reservation.user.toString() === req.user._id.toString()) ||
        (req.user && reservation.email.toLowerCase() === req.user.email.toLowerCase());

      if (!isOwner) {
        return sendError(res, 403, 'Unauthorized access to this reservation.');
      }
    }

    return sendSuccess(res, 200, 'Reservation details retrieved', reservation);
  } catch (error) {
    next(error);
  }
};

export const trackReservationByNumber = async (req, res, next) => {
  try {
    const { reservationNumber } = req.params;
    if (!reservationNumber) {
      return sendError(res, 400, 'Reservation reference number is required.');
    }

    const clean = reservationNumber.trim().toUpperCase();
    let reservation = await Reservation.findOne({ reservationNumber: clean });
    if (!reservation && clean.match(/^[0-9a-fA-F]{24}$/)) {
      reservation = await Reservation.findById(clean);
    }

    if (!reservation) {
      return sendError(res, 404, `No reservation found with reference #${clean}.`);
    }

    return sendSuccess(res, 200, 'Reservation status retrieved successfully', {
      id: reservation.reservationNumber,
      reservationNumber: reservation.reservationNumber,
      fullName: reservation.fullName,
      phone: reservation.phone,
      email: reservation.email,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      seatingArea: reservation.seatingArea,
      specialRequest: reservation.specialRequest,
      status: reservation.status,
      adminNotes: reservation.adminNotes,
      createdAt: reservation.createdAt
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminReservations = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { reservationNumber: { $regex: term, $options: 'i' } },
        { fullName: { $regex: term, $options: 'i' } },
        { phone: { $regex: term, $options: 'i' } }
      ];
    }

    const reservations = await Reservation.find(filter).sort({ date: -1, time: -1 });
    return sendSuccess(res, 200, 'All reservations retrieved', reservations);
  } catch (error) {
    next(error);
  }
};

export const updateAdminReservationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const allowed = ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return sendError(res, 400, `Invalid reservation status. Allowed: ${allowed.join(', ')}`);
    }

    let reservation = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      reservation = await Reservation.findById(id);
    }
    if (!reservation) {
      reservation = await Reservation.findOne({ reservationNumber: id.toUpperCase() });
    }
    if (!reservation) {
      return sendError(res, 404, 'Reservation not found.');
    }

    reservation.status = status;
    if (adminNotes !== undefined) {
      reservation.adminNotes = adminNotes;
    }

    await reservation.save();
    return sendSuccess(res, 200, `Reservation #${reservation.reservationNumber} marked as ${status}`, reservation);
  } catch (error) {
    next(error);
  }
};
