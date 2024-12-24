import express from 'express';
import { getAmount, order, payment, verify } from '../controllers/payment.controller.js';
const router = express.Router();

router.route('/payment').get(payment);
router.route('/order').post(order);
router.route('/verify').post(verify);
router.route('/getAmount').get(getAmount);

export default router;