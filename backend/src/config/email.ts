import nodemailer from 'nodemailer';
import { config } from './index';
import { logger } from '../utils/logger';
import { emailTemplateService } from './emailTemplates';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      html
    });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    logger.error(`Error sending email: ${error}`);
    throw new Error('Failed to send email');
  }
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  const subject = 'Welcome to TechNova Mobile';
  const html = emailTemplateService.render('welcome', {
    name,
    email,
    verificationUrl: `${config.frontendUrl}/verify-email/${email}`
  });
  await sendEmail(email, subject, html);
};

export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;
  const subject = 'Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563EB;">Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">Reset Password</a>
      <p style="margin-top: 20px; color: #6B7280;">This link will expire in 1 hour.</p>
      <p style="color: #6B7280;">If you didn't request this, please ignore this email.</p>
    </div>
  `;
  await sendEmail(email, subject, html);
};

export const sendOrderConfirmationEmail = async (
  email: string,
  orderNumber: string,
  orderDetails: {
    items: Array<{ name: string; price: number; quantity: number }>;
    totalAmount: number;
    shippingAddress: {
      fullName: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  }
): Promise<void> => {
  const subject = `Order Confirmation - #${orderNumber}`;
  const html = emailTemplateService.render('order-confirmation', {
    name: orderDetails.shippingAddress.fullName,
    orderNumber,
    items: orderDetails.items,
    totalAmount: orderDetails.totalAmount,
    shippingAddress: orderDetails.shippingAddress,
    trackingUrl: `${config.frontendUrl}/orders/${orderNumber}`
  });
  await sendEmail(email, subject, html);
};

export default transporter;

