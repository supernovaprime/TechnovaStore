import { Router } from 'express';
import messageController, { messageValidators } from '../controllers/message.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';
import { validate, validateId } from '../middleware/validation.middleware';

const router = Router();

router.post('/', ...messageValidators.create, validate, messageController.createMessage);

router.use(authenticate, adminOnly);

router.get('/', messageController.getAllMessages);
router.get('/:id', validateId, messageController.getMessageById);
router.put('/:id/reply', validateId, ...messageValidators.reply, validate, messageController.replyToMessage);
router.delete('/:id', validateId, messageController.deleteMessage);

export default router;
