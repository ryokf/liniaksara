
import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

const snap = new Midtrans.Snap({
    isProduction: true,
    serverKey: process.env.SECRET ?? '',
    clientKey: process.env.NEXT_PUBLIC_CLIENT,
});

export async function POST(request: Request) {
    const { price, id } = await request.json()

    const parameter = {
        transaction_details: {
            order_id: id,
            gross_amount: price
        },
        "customer_details": {
            "first_name": "TEST",
            "last_name": "UTOMO",
            "email": "test@midtrans.com",
            "phone": "+628123456",
            "billing_address": {
                "first_name": "TEST",
                "last_name": "UTOMO",
                "phone": "081 2233 44-55",
                "address": "Sudirman",
                "city": "Jakarta",
                "postal_code": "12190",
                "country_code": "IDN"
            },
            "shipping_address": {
                "first_name": "TEST",
                "last_name": "UTOMO",
                "phone": "0 8128-75 7-9338",
                "address": "Sudirman",
                "city": "Jakarta",
                "postal_code": "12190",
                "country_code": "IDN"
            }
        }
    }

    const token = await snap.createTransaction(parameter)
    console.log(token)
    return NextResponse.json(token)
}