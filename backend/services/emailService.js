import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

let transporter = null;

const isEmailConfigured = Boolean(
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
);

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  logger.info('Nodemailer transporter initialized');
} else {
  logger.warn('SMTP credentials not configured. Email notifications will be logged to console.');
}

const sendMailSafely = async (mailOptions) => {
  try {
    if (!transporter) {
      logger.info(`[Email Simulation] To: ${mailOptions.to} | Subject: ${mailOptions.subject}`);
      return { messageId: 'simulated_' + Date.now() };
    }
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Three Flames Restaurant <noreply@threeflames.pk>',
      ...mailOptions
    });
    logger.info(`Email delivered to ${mailOptions.to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Failed to send email to ${mailOptions.to}: ${error.message}`);
    return null;
  }
};

export const sendOrderConfirmationEmail = async (order) => {
  const itemsList = (order.items || [])
    .map(i => `<li>${i.quantity}x ${i.name} — Rs. ${i.itemTotal}</li>`)
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0c0806; color: #FFF7ED; padding: 24px; border-radius: 12px; border: 1px solid #F97316;">
      <h1 style="color: #FF8A1F; text-align: center; margin-bottom: 4px;">THREE FLAMES RESTAURANT</h1>
      <p style="text-align: center; color: #D99A32; margin-top: 0; font-size: 12px; letter-spacing: 2px;">WHERE TASTE MEETS FLAME</p>
      <hr style="border: 0; border-top: 1px solid #332014; margin: 20px 0;" />
      <h2 style="color: #FFF7ED;">Order Confirmed! #${order.orderNumber}</h2>
      <p>Dear ${order.customer?.name || 'Valued Diner'},</p>
      <p>Thank you for choosing Three Flames. Your order has been received and our pitmasters are firing up the charcoal!</p>
      <div style="background: #1A100C; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #FF8A1F;">Order Details</h3>
        <p><strong>Fulfillment:</strong> ${order.orderType?.toUpperCase()}</p>
        <p><strong>Estimated Time:</strong> ${order.estimatedTime || '35-45 mins'}</p>
        <ul style="padding-left: 20px;">
          ${itemsList}
        </ul>
        <hr style="border: 0; border-top: 1px solid #332014;" />
        <p style="font-size: 16px;"><strong>Total Amount: Rs. ${order.total}</strong> (${order.paymentMethod})</p>
      </div>
      <p style="font-size: 13px; color: #9CA3AF;">Need assistance? Call our hotline at <strong>0334-4226655</strong> or visit us at Bilour Chowk, Rehman Baba Road, University Town, Peshawar.</p>
    </div>
  `;

  return sendMailSafely({
    to: order.customer.email,
    subject: `Order Confirmed: #${order.orderNumber} — Three Flames Restaurant`,
    html
  });
};

export const sendReservationConfirmationEmail = async (reservation) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0c0806; color: #FFF7ED; padding: 24px; border-radius: 12px; border: 1px solid #F97316;">
      <h1 style="color: #FF8A1F; text-align: center; margin-bottom: 4px;">THREE FLAMES RESTAURANT</h1>
      <p style="text-align: center; color: #D99A32; margin-top: 0; font-size: 12px; letter-spacing: 2px;">WHERE TASTE MEETS FLAME</p>
      <hr style="border: 0; border-top: 1px solid #332014; margin: 20px 0;" />
      <h2 style="color: #FFF7ED;">Table Reservation Received #${reservation.reservationNumber}</h2>
      <p>Dear ${reservation.fullName},</p>
      <p>We look forward to hosting you for an extraordinary wood-fire culinary experience.</p>
      <div style="background: #1A100C; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Date:</strong> ${reservation.date}</p>
        <p><strong>Time:</strong> ${reservation.time}</p>
        <p><strong>Party Size:</strong> ${reservation.guests} Guests</p>
        <p><strong>Seating Preference:</strong> ${reservation.seatingArea}</p>
        <p><strong>Status:</strong> ${reservation.status.toUpperCase()}</p>
      </div>
      <p style="font-size: 13px; color: #9CA3AF;">Three Flames Restaurant — Bilour Chowk, Rehman Baba Road, University Town, Peshawar | Phone: 0334-4226655</p>
    </div>
  `;

  return sendMailSafely({
    to: reservation.email,
    subject: `Table Booking #${reservation.reservationNumber} — Three Flames Restaurant`,
    html
  });
};

export const sendContactMessageAlert = async (contact) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 16px;">
      <h2>New Customer Inquiry: ${contact.subject}</h2>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Phone:</strong> ${contact.phone || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #f4f4f4; padding: 12px; border-left: 4px solid #F97316;">${contact.message}</blockquote>
    </div>
  `;

  return sendMailSafely({
    to: process.env.EMAIL_FROM || 'info@threeflames.pk',
    subject: `New Inquiry from ${contact.name}: ${contact.subject}`,
    html
  });
};

export const sendOtpVerificationEmail = async ({ name, email, otp }) => {
  const html = `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #0c0806; color: #FFF7ED; padding: 32px 24px; border-radius: 16px; border: 1px solid #FF8A1F;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #FF8A1F; font-size: 26px; font-weight: 800; letter-spacing: 1px; margin: 0 0 4px 0;">THREE FLAMES RESTAURANT</h1>
        <p style="color: #D99A32; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin: 0;">WHERE TASTE MEETS FLAME</p>
      </div>

      <hr style="border: 0; border-top: 1px solid #332014; margin: 24px 0;" />

      <h2 style="color: #FFFFFF; font-size: 20px; font-weight: 700; margin: 0 0 16px 0;">Verify Your Email Address</h2>

      <p style="color: #FFF7ED; font-size: 15px; line-height: 1.6; margin: 0 0 12px 0;">
        Dear <strong>${name || 'Valued Diner'}</strong>,
      </p>

      <p style="color: #B8AAA0; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
        Thank you for joining Three Flames Restaurant! To activate your account and verify your email address, please enter the following 6-digit verification code:
      </p>

      <div style="background: #1A100C; border: 2px dashed #FF8A1F; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
        <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #FF8A1F; display: inline-block;">
          ${otp}
        </span>
      </div>

      <p style="color: #F97316; font-size: 13px; font-weight: 600; text-align: center; margin: 0 0 24px 0;">
        ⏱️ This code will expire in <strong>10 minutes</strong>.
      </p>

      <div style="background: #140D0A; border-left: 4px solid #FF8A1F; padding: 14px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
        <p style="color: #FFF7ED; font-size: 13px; font-weight: 700; margin: 0 0 4px 0;">Security Notice</p>
        <p style="color: #B8AAA0; font-size: 12px; line-height: 1.5; margin: 0;">
          Never share this code with anyone. Three Flames staff will never ask you for your verification code. If you did not request this registration, you can safely disregard this email.
        </p>
      </div>

      <hr style="border: 0; border-top: 1px solid #332014; margin: 24px 0;" />

      <p style="font-size: 12px; color: #8C7E75; text-align: center; margin: 0; line-height: 1.5;">
        Three Flames Restaurant — Bilour Chowk, Rehman Baba Road, University Town, Peshawar<br />
        Helpline: 0334-4226655 | WhatsApp: 923344226655
      </p>
    </div>
  `;

  return sendMailSafely({
    to: email,
    subject: 'Verify Your Three Flames Restaurant Account',
    html
  });
};

