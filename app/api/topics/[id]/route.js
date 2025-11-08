// app/api/topics/[id]/route.js
import connectMongoDB from '@/libs/mongodb';
import { NextResponse } from 'next/server';
import Topic from '@/libs/models/topic';
import { validateTopic, validateId } from '@/libs/validation';

/**
 * @swagger
 * /api/topics/{id}:
 *   get:
 *     summary: Get a topic by ID
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "690c5f9b8c7388741280cead"
 *     responses:
 *       200:
 *         description: Topic retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Topic not found
 */
export async function GET(request, { params }) {
  try {
    const { id } =await params;
    validateId(id);
    await connectMongoDB();
    const topic = await Topic.findById(id);
    if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    return NextResponse.json({ topic }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/topics/{id}:
 *   put:
 *     summary: Update a topic by ID
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "690c5f9b8c7388741280cead"
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
 *                 example: "Updated Title"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *     responses:
 *       200:
 *         description: Topic updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Topic not found
 */
export async function PUT(request, { params }) {
  try {
    const { id } =await params;
    validateId(id);
    const { title, description } = await request.json();
    validateTopic({ title, description });
    await connectMongoDB();
    const updatedTopic = await Topic.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!updatedTopic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    return NextResponse.json({ message: 'Topic updated', topic: updatedTopic }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
