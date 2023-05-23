jest.mock("winston", () => ({
  esModule: true,
  createLogger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
    info: jest.fn(),
    http: jest.fn(),
    debug: jest.fn(),
    alert: jest.fn(),
    warn: jest.fn(),
  })),
  transports: {
    Console: jest.fn(),
  },
  format: {
    combine: jest.fn(),
    colorize: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
    errors: jest.fn(),
  },
}))

jest.mock("nanoid", () => ({
  esModule: true,
  nanoid: jest.fn().mockImplementation(() => "nanoid_id"),
}))

jest.mock("../../util/file", () => {
  return {
    __esModule: true,
    default: {
      write: jest.fn().mockImplementation((_: string, data: string) => data),
      read: jest.fn(),
      list: jest.fn(),
      exists: jest.fn().mockImplementation(() => false),
    },
  }
})
