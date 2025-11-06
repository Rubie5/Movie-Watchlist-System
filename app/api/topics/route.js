// app/api/topics/route.js
import { NextResponse } from "next/server";
import Topic from "@/libs/models/topic";           // FIXED
import connectMongoDB from "@/libs/mongodb";       // FIXED

export async function POST(request) {
    const { title, description } = await request.json();
    await connectMongoDB();
    await Topic.create({ title, description });
    return NextResponse.json({ message: "Topic Created" }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const topics = await Topic.find();
    return NextResponse.json({ topics });
}