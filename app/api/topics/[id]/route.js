import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import Topic from "@/libs/models/topic";

export async function PUT(request,{params}){
    const { id } = params;
    const { newtitle: title, newdescription: description } = await request.json();
    await connectMongoDB();
    await Topic.findByIdAndUpdate(id, { title, description });
    return NextResponse.json({ message: "Topic updated" }, { status: 200 });
}
