// app/api/check-status/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing transaction ID' }, { status: 400 });
    }

    const response = await fetch(`https://api.midtrans.com/v2/${id}/status`, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Basic ${process.env.MIDTRANS_SERVER_KEY}`  // simpan di .env.local
        }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}