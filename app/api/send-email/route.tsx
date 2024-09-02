
import { NextResponse } from "next/server";
import { Resend } from "resend";
import Email  from "@/emails";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request, res: Response) {
    const response = await req.json();
    try {
        const data = await resend.emails.send({
            from: 'foodie-cart.app.carlos.develop.com',
            to: [response.email],
            subject: 'Foodie Cart - Order Confirmation',
            react: Email(),
        });
        // Your logic here
        return NextResponse.json({ data });
    } catch (error) {
        // Handle the error
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}



