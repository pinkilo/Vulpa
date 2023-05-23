import { testYuki } from "@pinkilo/yukibot"
import { ListCommands } from "../../yuki"

let sendSpy

it("should send message", async () => {
  const ty = await testYuki((y) => {
    y.yukiConfig.prefix = /^>/
    y.googleConfig = { clientId: "", clientSecret: "", redirectUri: "" }
    y.tokenLoader = async () => ({})
    ListCommands(y)
    sendSpy = jest.spyOn(y, "sendMessage")
  })
  await ty.feedMessage(">commands")
  expect(sendSpy).toHaveBeenCalledTimes(1)
})
