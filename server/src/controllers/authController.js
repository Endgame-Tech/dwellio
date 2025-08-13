import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Helper: Generate JWT
const generateToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET;
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: '1h' }
  );
};

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, role } = req.body;
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or phone number already exists.' });
    }
    const user = new User({ firstName, lastName, email, phoneNumber, password, role });
    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    const token = generateToken(user);
    res.status(201).json({ 
      success: true,
      message: 'User registered successfully.', 
      user: userObj,
      token 
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;
    if ((!email && !phoneNumber) || !password) {
      return res.status(400).json({ message: 'Email or phone number and password are required.' });
    }
    const user = await User.findOne(email ? { email } : { phoneNumber });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get current user profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ 
      success: true, 
      data: user 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const updates = (({ firstName, lastName, phoneNumber, preferredContactMethod, profilePhoto }) => ({ firstName, lastName, phoneNumber, preferredContactMethod, profilePhoto }))(req.body);
    const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true, runValidators: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Both old and new passwords are required.' });
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(401).json({ message: 'Old password is incorrect.' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Password Reset Request
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    // Send email (using nodemailer, configure with your SMTP credentials)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:4000'}/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`
    });
    res.json({ message: 'Password reset email sent.' });
  } catch (err) {
    console.error('Password Reset Request Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }
    // Hash the provided token
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    // Find user with matching token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const requestEmailVerification = async (req, res) => {
  try {
    const user = req.user ? await User.findById(req.user.userId) : null;
    const email = user ? user.email : req.body.email;
    if (!email) return res.status(400).json({ message: 'Email is required.' });
    const targetUser = user || await User.findOne({ email });
    if (!targetUser) return res.status(404).json({ message: 'User not found.' });
    if (targetUser.isVerified) return res.status(400).json({ message: 'Email already verified.' });

    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenHash = crypto.createHash('sha256').update(verifyToken).digest('hex');
    targetUser.emailVerifyToken = verifyTokenHash;
    targetUser.emailVerifyExpires = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
    await targetUser.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:4000'}/verify-email/${verifyToken}`;
    await transporter.sendMail({
      to: targetUser.email,
      subject: 'Verify Your Email',
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email. This link will expire in 24 hours.</p>`
    });
    res.json({ message: 'Verification email sent.' });
  } catch (err) {
    console.error('Email Verification Request Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is required.' });
    const verifyTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      emailVerifyToken: verifyTokenHash,
      emailVerifyExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired verification token.' });
    user.isVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save();
    res.json({ message: 'Email verified successfully.' });
  } catch (err) {
    console.error('Verify Email Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Middleware: Require Auth
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware: Role-based access
export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient role.' });
  }
  next();
};
