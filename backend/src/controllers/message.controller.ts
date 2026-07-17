import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { Message } from '../models';
import { ApiResponse } from '../utils/apiResponse';
import { getPaginationParams } from '../utils/pagination';
import { logger } from '../utils/logger';

const messageController = {
  getAllMessages: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, skip } = getPaginationParams(req.query);
      const query: any = {};

      if (req.query.status) {
        query.status = req.query.status;
      }

      if (req.query.priority) {
        query.priority = req.query.priority;
      }

      if (req.query.category) {
        query.category = req.query.category;
      }

      if (req.query.search) {
        query.$or = [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
          { subject: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      const [messages, total] = await Promise.all([
        Message.find(query)
          .populate('user', 'name email')
          .populate('reply.repliedBy', 'name email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Message.countDocuments(query)
      ]);

      ApiResponse.paginated(res, messages, { page: Number(page), limit: Number(limit), total }, 'Messages fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  getMessageById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const message = await Message.findById(req.params.id)
        .populate('user', 'name email')
        .populate('reply.repliedBy', 'name email')
        .lean();

      if (!message) {
        ApiResponse.error(res, 'Message not found', 404);
        return;
      }

      if (message.status === 'unread') {
        message.status = 'read';
        await Message.findByIdAndUpdate(req.params.id, { status: 'read' });
      }

      logger.debug(`Message fetched: ${req.params.id}`);
      ApiResponse.success(res, message, 'Message fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  createMessage: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const message = await Message.create(req.body);
      logger.info(`Message created: ${message._id}`);
      ApiResponse.success(res, message, 'Message sent successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  replyToMessage: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { content } = req.body;
      const message = await Message.findById(req.params.id);

      if (!message) {
        ApiResponse.error(res, 'Message not found', 404);
        return;
      }

      message.reply = {
        content,
        repliedBy: req.user!._id,
        repliedAt: new Date()
      };
      message.status = 'replied';
      await message.save();

      logger.info(`Reply sent for message: ${req.params.id}`);
      ApiResponse.success(res, message, 'Reply sent successfully');
    } catch (error) {
      next(error);
    }
  },

  deleteMessage: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const message = await Message.findById(req.params.id);
      if (!message) {
        ApiResponse.error(res, 'Message not found', 404);
        return;
      }

      await message.deleteOne();
      logger.info(`Message deleted: ${req.params.id}`);
      ApiResponse.success(res, null, 'Message deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

export const messageValidators = {
  create: [body('name').notEmpty().withMessage('Name is required'), body('email').isEmail().withMessage('Valid email is required'), body('subject').notEmpty().withMessage('Subject is required'), body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters')],
  reply: [body('content').notEmpty().withMessage('Reply content is required')]
};

export default messageController;
