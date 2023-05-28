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
  nanoid: jest
    .fn()
    .mockName("nanoid")
    .mockImplementation(() => "nanoid_id"),
}))

jest.mock("../../util/file", () => {
  return {
    __esModule: true,
    default: {
      write: jest
        .fn()
        .mockName("file write")
        .mockImplementation((_: string, data: string) => data),
      read: jest.fn().mockName("file read"),
      list: jest.fn().mockName("file list"),
      exists: jest
        .fn()
        .mockName("file exists")
        .mockImplementation(() => false),
    },
  }
})

jest.mock("../../yuki/MoneySystem/config", () => {
  const actual = jest.requireActual("../../yuki/MoneySystem/config")
  return {
    __esModule: true,
    ...actual,
    walletCache: {
      get: jest.fn(() => actual.startingWallet),
      put: jest.fn(),
      save: jest.fn(),
    },
  }
})
