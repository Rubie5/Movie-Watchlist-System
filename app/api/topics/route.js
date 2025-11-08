// app/api/topics/route.js
import { NextResponse } from "next/server";
import Topic from "@/libs/models/topic";
import connectMongoDB from "@/libs/mongodb";
import { validateTopic, validateId } from "@/libs/validation";



/**
 * @swagger
 * /api/topics:
 *   post:
 *     summary: Create a new movie topic
 *     description: Creates a new movie topic in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: Movie title
 *                 example: "The Breakfast Mistake"
 *               description:
 *                 type: string
 *                 description: Short description of the movie
 *                 example: "A funny movie."
 *     responses:
 *       201:
 *         description: Topic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Topic Created"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Title is required, Description is required"
 */

// Create a new topic
export async function POST(request) {
    try {
        const { title, description } = await request.json();

        // Validate request body
        validateTopic({ title, description });

        await connectMongoDB();
        const newTopic = await Topic.create({ title, description });

        return NextResponse.json({ message: "Topic Created", topic: newTopic }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

/**
 * @swagger
 * /api/topics:
 *   get:
 *     summary: Get all movie topics
 *     description: Retrieves a list of all movie topics from the database
 *     responses:
 *       200:
 *         description: List of movie topics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "690c5f9b8c7388741280cead"
 *                       title:
 *                         type: string
 *                         example: "The Breakfast Mistake"
 *                       description:
 *                         type: string
 *                         example: "A funny movie."
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-07T10:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-07T10:05:00Z"
 */


// Get all topics
export async function GET() {
    try {
        await connectMongoDB();
        const topics = await Topic.find();
        return NextResponse.json({ topics }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


/**
 * @swagger
 * /api/topics/{id}:
 *   put:
 *     summary: Update a movie topic by ID
 *     description: Updates the title or description of a movie topic using its ID.
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the topic to update
 *         schema:
 *           type: string
 *           example: "690c5f9b8c7388741280cead"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the movie
 *                 example: "The Updated Breakfast Mistake"
 *               description:
 *                 type: string
 *                 description: Updated short description
 *                 example: "A funny and heartwarming movie about breakfast gone wrong."
 *     responses:
 *       200:
 *         description: Topic updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Topic updated successfully"
 *                 topic:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "690c5f9b8c7388741280cead"
 *                     title:
 *                       type: string
 *                       example: "The Updated Breakfast Mistake"
 *                     description:
 *                       type: string
 *                       example: "A funny and heartwarming movie about breakfast gone wrong."
 *       400:
 *         description: Invalid input or ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid ID or missing fields"
 *       404:
 *         description: Topic not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Topic not found"
 */


// Update topic by ID
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, description } = await request.json();

    // Validate ID and input
    validateId(id);
    validateTopic({ title, description });

    await connectMongoDB();

    const updatedTopic = await Topic.findByIdAndUpdate(
      id,
      { title, description },
      { new: true } // return the updated document
    );

    if (!updatedTopic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Topic updated successfully", topic: updatedTopic },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}


/**
 * @swagger
 * /api/topics:
 *   delete:
 *     summary: Delete a movie topic by ID
 *     description: Deletes a specific movie topic from the database using its ID
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the topic to delete
 *         example: "690c5f9b8c7388741280cead"
 *     responses:
 *       200:
 *         description: Topic deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Topic deleted"
 *       400:
 *         description: Invalid ID supplied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid ID"
 *       404:
 *         description: Topic not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Topic not found"
 */


// Delete a topic by ID
export async function DELETE(request) {
    try {
        const id = request.nextUrl.searchParams.get("id");

        // Validate ID
        validateId(id);

        await connectMongoDB();
        const deletedTopic = await Topic.findByIdAndDelete(id);

        if (!deletedTopic) {
            return NextResponse.json({ error: "Topic not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Topic deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
