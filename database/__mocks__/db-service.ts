import mockRunners from '@/test-utils/mock-data/runners'

export const DBService = {
  getAllRunners: jest.fn().mockResolvedValue(mockRunners),
  incrementRunnerLap: jest.fn().mockImplementation(() => Promise.resolve()),
  upsertRunner: jest.fn().mockImplementation(() => Promise.resolve()),
  deleteRunner: jest.fn().mockImplementation(() => Promise.resolve()),
}
