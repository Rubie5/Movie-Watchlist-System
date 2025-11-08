// tests/setup.js

// Set your test MongoDB URI
process.env.MONGODB_URI = 'mongodb+srv://roji71418_db_user:d2ryc1TrJ5rnBIHv@cluster0.1wjknme.mongodb.net/movie_db';

// Mock NextResponse for API routes
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data, options = {}) => ({
      json: () => Promise.resolve(data),
      status: options.status || 200,
      headers: options.headers || {},
    }),
  },
}));

// Mock MongoDB connection
jest.mock('@/libs/mongodb', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(),
}));

// Mock Mongoose models
jest.mock('@/libs/models/topic', () => ({
  __esModule: true,
  default: {
    create: jest.fn().mockResolvedValue({
      _id: '690c5f9b8c7388741280cead', // your specified ID
      title: 'Test',
      description: 'Test Desc',
    }),
    find: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockResolvedValue({
      _id: '690c5f9b8c7388741280cead',
      title: 'Test',
      description: 'Test Desc',
    }),
    findByIdAndUpdate: jest.fn().mockResolvedValue({
      _id: '690c5f9b8c7388741280cead',
      title: 'Updated',
      description: 'Updated Desc',
    }),
    findByIdAndDelete: jest.fn().mockResolvedValue({}),
    findOne: jest.fn().mockResolvedValue({}),
  },
}));

// Dummy test to satisfy Jest requirement
test('setup file loaded', () => {
  expect(true).toBe(true);
});
