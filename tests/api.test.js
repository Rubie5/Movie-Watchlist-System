import { POST, GET, DELETE } from '@/app/api/topics/route';
import { PUT, GET as GET_SINGLE } from '@/app/api/topics/[id]/route';
import Topic from '@/libs/models/topic';
import connectMongoDB from '@/libs/mongodb';

// Mock the dependencies
jest.mock('@/libs/mongodb', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true), // ensure it returns a resolved promise
}));
jest.mock('@/libs/models/topic');

describe('API Routes', () => {
  const mockId = '690c5f9b8c7388741280cead'; // Mock ObjectId

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // POST /api/topics
  describe('POST /api/topics', () => {
    it('should create a topic successfully', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ title: 'Test', description: 'Test Desc' }),
      };
      Topic.create.mockResolvedValue({ _id: mockId, title: 'Test', description: 'Test Desc' });

      const response = await POST(mockRequest);
      const result = await response.json();

      expect(connectMongoDB).toHaveBeenCalled();
      expect(Topic.create).toHaveBeenCalledWith({ title: 'Test', description: 'Test Desc' });
      expect(result.message).toBe('Topic Created');
      expect(result.topic).toHaveProperty('title', 'Test');
    });

    it('should return error for invalid data', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ title: '', description: '' }),
      };

      const response = await POST(mockRequest);
      const result = await response.json();

      expect(result.error).toBeDefined();
      expect(response.status).toBe(400);
    });
  });

  // GET /api/topics
  describe('GET /api/topics', () => {
    it('should fetch all topics', async () => {
      const mockTopics = [{ title: 'Test', description: 'Test Desc' }];
      Topic.find.mockResolvedValue(mockTopics);

      const response = await GET();
      const result = await response.json();

      expect(connectMongoDB).toHaveBeenCalled();
      expect(Topic.find).toHaveBeenCalled();
      expect(result.topics).toEqual(mockTopics);
    });
  });

  // GET /api/topics/:id
  describe('GET /api/topics/:id', () => {
    it('should fetch a single topic by ID', async () => {
      const mockRequest = {};
      const mockParams = { id: mockId };
      Topic.findById.mockResolvedValue({ title: 'Test', description: 'Test Desc' });

      const response = await GET_SINGLE(mockRequest, { params: mockParams });
      const result = await response.json();

      expect(connectMongoDB).toHaveBeenCalled();
      expect(Topic.findById).toHaveBeenCalledWith(mockId);
      expect(result.topic).toEqual({ title: 'Test', description: 'Test Desc' });
    });
  });

  // PUT /api/topics/:id
  describe('PUT /api/topics/:id', () => {
    it('should update a topic by ID', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          title: 'Updated',
          description: 'Updated Desc',
        }),
      };
      const mockParams = { id: mockId };

      Topic.findByIdAndUpdate.mockResolvedValue({
        title: 'Updated',
        description: 'Updated Desc',
      });

      const response = await PUT(mockRequest, { params: mockParams });
      const result = await response.json();

      expect(connectMongoDB).toHaveBeenCalled();
      expect(Topic.findByIdAndUpdate).toHaveBeenCalledWith(
        mockId,
        { title: 'Updated', description: 'Updated Desc' },
        { new: true }
      );
      expect(result.message).toBe('Topic updated');
      expect(result.topic).toHaveProperty('title', 'Updated');
    });
  });

  // DELETE /api/topics
  describe('DELETE /api/topics', () => {
    it('should delete a topic by ID', async () => {
      const mockRequest = {
        nextUrl: {
          searchParams: {
            get: jest.fn().mockReturnValue(mockId),
          },
        },
      };
      Topic.findByIdAndDelete.mockResolvedValue({});

      const response = await DELETE(mockRequest);
      const result = await response.json();

      expect(connectMongoDB).toHaveBeenCalled();
      expect(Topic.findByIdAndDelete).toHaveBeenCalledWith(mockId);
      expect(result.message).toBe('Topic deleted');
    });
  });
});
