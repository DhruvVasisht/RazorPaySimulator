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

export const payment = (req, res) => {
  res.json("Payment Details");
};

export const order = (req, res) => {
  const { amount } = req.body;
  try {
    const options = {
      amount: Number(amount * 100), //Amount in Paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"), // Random receipt number
      payment_capture: 1, //Payment capture
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          message: "Server Error",
          success: false,
        });
      } else {
        res.status(200).json({
          data: order,
        });
        // console.log(order)
      }
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

export const verify = async (req, res) => {
  const { amount, razorpay_signature, razorpay_payment_id, razorpay_order_id } =
    req.body;

  try {
    //Create Signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    //Expected Signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    // console.log(isAuthentic);
    if (isAuthentic) {
      const payment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
      });
      // Save Payment to MongoDb
      await payment.save();
      const getUser = await User.findOne({ name: "Dhruv" });
      // console.log(getUser);
      if (getUser) {
        getUser.userBalance = Number(getUser.userBalance) + Number(amount / 100);
        console.log(`Updated user details: ${JSON.stringify(getUser)}`);
        await getUser.save();
    } else {
        const user = new User({
          name: "Dhruv",
          userBalance: amount / 100,
        });
        await user.save();
      }

      res.status(200).json({
        message: "Payment Success",
        success: true,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

export const getAmount = async (req, res) => {
  try {
    const user = await User.findOne({ name: "Dhruv" });
    if (user) {
      console.log(user);
      res.json({
        amount: user.userBalance,
      });
    } else {
      res.json({
          message: "User not found",
          success: false
      });
      console.log("User not found");
    }
  } catch (err) {}
};
