import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_jwt_secret_key', {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, avatar } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user',
            avatar: avatar || '',
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email (explicitly select password)
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.avatar = req.body.avatar || user.avatar;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Auth user via Google
// @route   POST /api/auth/google-login
// @access  Public
export const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ success: false, message: 'Google ID Token is required' });
        }

        const clientId = process.env.GOOGLE_CLIENT_ID;
        let email, name, picture;

        // Try cryptographic validation locally
        try {
            const client = new OAuth2Client(clientId);
            const ticket = await client.verifyIdToken({
                idToken,
                audience: clientId,
            });
            const payload = ticket.getPayload();
            email = payload.email;
            name = payload.name;
            picture = payload.picture;
        } catch (verifyError) {
            console.warn('Google Client ID verification failed, fallback to direct validation:', verifyError.message);

            // Fallback verification using Google's tokeninfo API
            const ticketResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
            if (!ticketResponse.ok) {
                return res.status(400).json({ success: false, message: 'Invalid or expired Google Token' });
            }
            const payload = await ticketResponse.json();
            email = payload.email;
            name = payload.name;
            picture = payload.picture;
        }

        if (!email) {
            return res.status(400).json({ success: false, message: 'Google Token does not contain email payload' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // Auto-register the Google user with a generated password to satisfy schema
            const randomPassword = Math.random().toString(36).slice(-10) + 'G!1a';
            user = await User.create({
                name,
                email,
                password: randomPassword,
                avatar: picture || '',
                role: 'user',
            });
        } else {
            // Update avatar if missing
            if (!user.avatar && picture) {
                user.avatar = picture;
                await user.save();
            }
        }

        res.status(200).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

