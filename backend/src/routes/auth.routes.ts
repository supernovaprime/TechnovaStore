import { Router } from 'express';
import authController, { authValidators } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum: [customer, admin]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or email already exists
 */
router.post('/register', authLimiter, ...authValidators.register, validate, authController.register);
router.post('/login', authLimiter, ...authValidators.login, validate, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', authLimiter, ...authValidators.forgotPassword, validate, authController.forgotPassword);
router.post('/reset-password', ...authValidators.resetPassword, validate, authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);

router.use(authenticate);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.post('/logout', authController.logout);
router.post('/change-password', ...authValidators.changePassword, validate, authController.changePassword);

export default router;
