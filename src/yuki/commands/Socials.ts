import { YukiBuilder } from "@pinkilo/yukibot"

type SocialData = [name: string, message: string, alias?: string[]]

const social = (y: YukiBuilder, [name, message, alias]: SocialData) =>
  y.command((c) => {
    c.name = name
    c.alias = alias
    c.rateLimit.global = 60
    c.invoke = () => y.sendMessage(message)
  })

const socials: SocialData[] = [
  [
    "discord",
    `Check out the NL Discord! Followers & Subs get special roles ooo *special*
     you know u want it ( ͡° ͜ʖ ͡°) https://discord.gg/3dYzJXJStR`,
  ],
  ["twitter", "Follow Jono on twitter! https://twitter.com/JonoDieEnte"],
  [
    "youtube",
    `Like fish and aquariums? Like looking at my face? Well if you 
     do, make sure to check out my other channel, Aquatic Mastery! 
     https://www.youtube.com/aquaticmaster`,
    ["fish", "aquatic", "mastery"],
  ],
  ["twitch", "Check out the stream on Twitch if you prefer! https://twitch.tv/nlyuki"],
]

export default async (y: YukiBuilder) => {
  for (let s of socials) await social(y, s)
}
