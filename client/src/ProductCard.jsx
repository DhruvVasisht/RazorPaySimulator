import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";


export default function ProductCard() {
    const amount =350;

    // handlePayment Function
    const handlePayment = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/v1/payments/order`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    amount
                })
            });

            const data = await res.json();
            console.log(data);
            handlePaymentVerify(data.data)
        } catch (error) {
            console.log(error);
        }
    }

    // handlePaymentVerify Function
    const handlePaymentVerify = async (data) => {
        const options = {
            key: "rzp_test_Md2dB2qtXwvHmv",
            amount: data.amount,
            currency: data.currency,
            name: "D&D",
            description: "Test Mode",
            order_id: data.id,
            handler: async (response) => {
                console.log("response", response)
                try {
                    const res = await fetch(`http://localhost:3000/api/v1/payments/verify`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            amount: data.amount,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        })
                    })

                    const verifyData = await res.json();

                    if (verifyData.message) {
                        console.log(verifyData.message);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            theme: {
                color: "#5f63b8"
            }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    }
    return (
        <Card className="mt-6 w-96 bg-[#222f3e] text-white">
            <CardHeader color="" className="relative h-96 bg-[#2C3A47]">
                <img
                    src="https://codeswear.nyc3.cdn.digitaloceanspaces.com/tshirts/pack-of-five-plain-tshirt-white/1.webp"
                    alt="card-image"
                />
            </CardHeader>

            <CardBody>
                <Typography variant="h5" className="mb-2">
                   Adidas T-Shirt
                </Typography>

                <Typography>
                    ₹350 <span className=" line-through">₹699</span>
                </Typography>
            </CardBody>

            <CardFooter className="pt-0">
                <Button onClick={handlePayment} className="w-full bg-[#1B9CFC]">Buy Now</Button>
            </CardFooter>
        </Card>
    );
}