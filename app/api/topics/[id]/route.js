import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import Topic from "@/libs/models/topic";

export async function PUT(request,{params}){
    const { id } = await params;
    const { newtitle: title, newdescription: description } = await request.json();
    await connectMongoDB();
    await Topic.findByIdAndUpdate(id, { title, description });
    return NextResponse.json({ message: "Topic updated" }, { status: 200 });
}
export async function GET(request,{params}){
    const { id } = await params;
    await connectMongoDB();
    const topic =  await Topic.findById(id);
    return NextResponse.json({ topic }, { status: 200 });
}