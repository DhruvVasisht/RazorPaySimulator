import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { Payment } from "../models/payment.model.js";
import { User } from "../models/user.model.js";

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEYID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Payment endpoint (for testing connectivity)
export const payment = (req, res) => {
  res.json({ message: "Payment Details" });
};

// Create a new Razorpay order
export const order = async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res
      .status(400)
      .json({ message: "Amount is required", success: false });
  }

  const options = {
    amount: Math.round(amount * 100), // Amount in paise
    currency: "INR",
    receipt: crypto.randomBytes(10).toString("hex"), // Random receipt number
    payment_capture: 1, // Payment capture
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ data: order });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ message: "Failed to create order", success: false });
  }
};

// Verify Razorpay payment
export const verify = async (req, res) => {
  const { amount, razorpay_signature, razorpay_payment_id, razorpay_order_id } =
    req.body;

  if (!razorpay_signature || !razorpay_payment_id || !razorpay_order_id) {
    return res
      .status(400)
      .json({ message: "Invalid payment details", success: false });
  }

  try {
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ message: "Invalid signature", success: false });
    }

    // Save payment to database
    const payment = new Payment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    });

    await payment.save();

    const userName = "Dhruv";
    let user = await User.findOne({ name: userName });

    if (user) {
      user.userBalance = Number(user.userBalance) + Number(amount) / 100;
    } else {
      user = new User({ name: userName, userBalance: Number(amount) / 100 });
    }

    await user.save();

    res.status(200).json({ message: "Payment successful", success: true });
  } catch (error) {
    console.error("Verification failed:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Retrieve user balance
export const getAmount = async (req, res) => {
  const userName = "Dhruv";

  try {
    const user = await User.findOne({ name: userName });

    if (user) {
      return res.json({ amount: user.userBalance });
    }

    res.status(404).json({ message: "User not found", success: false });
  } catch (error) {
    console.error("Failed to fetch user balance:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
