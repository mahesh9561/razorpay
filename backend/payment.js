const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3005;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/app', (req, res) => {
    res.send("Server is running");
    console.log("server running");
    console.log(req.body);
});
app.post('/orders', async (req, res) => {
    console.log("server running");
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_Key_Id,
            key_secret: process.env.RAZORPAY_Key_Secret
        });

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ "req.body": "Bad request: No data provided" });
        }

        const order = await razorpay.orders.create({
            amount: req.body.amount * 100, // Convert to paise
            currency: req.body.currency,
            receipt: req.body.receipt
        });

        // Return the created order ID
        res.json({ id: order.id });
    } catch (error) {
        console.error("Error while processing order:", error);
        res.status(500).json("Internal server error while processing order");
    }
});


app.post('/validate', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const sha = crypto.createHmac('sha256', process.env.RAZORPAY_Key_Secret);
    // order_id + '|' + razorpay_payment_id
    sha.update(`${razorpay_order_id} | ${razorpay_payment_id}`)
    const digest = sha.digest("hex");
    if (digest !== razorpay_signature) {
        return res.status(400).json({ msg: "trasaction is not legit" })
    }
    res.json({msg:"Transaction is legit!"})
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
