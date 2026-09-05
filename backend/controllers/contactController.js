import { ContactMessage } from '../models/ContactMessage.js';
import { sendContactMessageAlert } from '../services/emailService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = await ContactMessage.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      subject: subject || 'Customer Inquiry',
      message
    });

    // Send async email alert to restaurant
    sendContactMessageAlert(contact).catch(() => {});

    return sendSuccess(res, 201, 'Thank you! Your inquiry has been received. Our team will contact you shortly.', contact);
  } catch (error) {
    next(error);
  }
};

export const getAdminContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Customer inquiries retrieved', messages);
  } catch (error) {
    next(error);
  }
};

export const markContactMessageRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const msg = await ContactMessage.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!msg) {
      return sendError(res, 404, 'Message not found.');
    }
    return sendSuccess(res, 200, 'Message marked as read', msg);
  } catch (error) {
    next(error);
  }
};

export const deleteContactMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const msg = await ContactMessage.findByIdAndDelete(id);
    if (!msg) {
      return sendError(res, 404, 'Message not found.');
    }
    return sendSuccess(res, 200, 'Message deleted successfully');
  } catch (error) {
    next(error);
  }
};
