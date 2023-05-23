import { testYuki } from "@pinkilo/yukibot"
import Beans from "../../yuki/commands/Beans"

let sendSpy: jest.SpyInstance
let ty

beforeEach(async () => {
  ty = await testYuki((y) => {
    y.yukiConfig.prefix = /^>/
    y.googleConfig = { clientId: "", clientSecret: "", redirectUri: "" }
    y.tokenLoader = async () => ({})
    Beans(y)
    sendSpy = jest.spyOn(y, "sendMessage")
  })
})

it("should send message", async () => {
  await ty.feedMessage(">beans")
  expect(sendSpy).toHaveBeenCalledTimes(1)
})

it("should should respond to 🫘 with bean", async () => {
  await ty.feedMessage(">🫘")
  expect(sendSpy).toHaveBeenCalledWith("bean!")
})

it("should respond to BEAN with single 🫘", async () => {
  await ty.feedMessage(">bean")
  expect(sendSpy).toHaveBeenCalledWith("🫘")
})

it("should respond to BEANS with multiple 🫘", async () => {
  jest.spyOn(Math, "random").mockImplementation(() => 0.1)
  await ty.feedMessage(">beans")
  sendSpy.mockImplementation((text) => text)
  expect(sendSpy).toHaveBeenCalledWith("🫘🫘🫘")
})
