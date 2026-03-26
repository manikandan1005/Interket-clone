import { NextResponse } from "next/server";

export async function GET() {
    const data = [
        { id: 1, name: "Mani" },
        { id: 2, name: "John" }
    ];
    return NextResponse.json(data)
}