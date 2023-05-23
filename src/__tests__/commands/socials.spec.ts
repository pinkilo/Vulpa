import { testYuki } from "@pinkilo/yukibot/"
import { Socials } from "../../yuki"
import { TestYuki } from "@pinkilo/yukibot"

const socials = ["discord", "twitter", "youtube", "fish", "aquatic", "mastery", "twitch"]
let sendSpy
let ty: TestYuki

beforeEach(async () => {
  ty = await testYuki((y) => {
    y.yukiConfig.prefix = /^>/
    y.googleConfig = { clientId: "", clientSecret: "", redirectUri: "" }
    y.tokenLoader = async () => ({})
    Socials(y)
    sendSpy = jest.spyOn(y, "sendMessage")
  })
})

for (let name of socials) {
  it(`should send message on ${name}`, async () => {
    await ty.feedMessage(`>${name}`)
    expect(sendSpy).toHaveBeenCalledTimes(1)
  })
}
