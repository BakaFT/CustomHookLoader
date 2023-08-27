# Introduction

Most HTTP request are done by XMLHttpRequest/Ajax in LeagueClient. So it's possible to hook it to edit the request param or resonse body. Literally at this point we are doing the MTIM(Man-in-the-middle) attack.

Whether is this useful depends on your imagination. 

# Example

Like in Tencent Server they disabled many features of client by editing server namespace configs:

- Separated chat window
- Profile status
- Mass disenchant

And enabled some stuff in the same way:

- Profile privacy(curious why global server do not enable this) 
- Texts under navbar icons(loot/shop/profile)

**BUT THEY DO NOT CHECK IN LOCAL.** That means these functions is totally working but disabled by a Server message.

That's why I have a Tencent server specific plugin [BetterTencentLCU](https://github.com/BakaFT/BetterTencentLCU)

## BetterTencentLCU

```javascript
// If it's for CustomHookLoader it should always export a array of hooks
// so do not be confused when this is different from BetterTencentLCU repo.
export default [
    {
        // Separated chat window & Profile status
        matcher: "/lol-platform-config/v1/namespaces/LcuSocial",
        preSend: (XhrRequestConfig) => {},
        postSend: (XhrResponse) => {
            const respJson = JSON.parse(XhrResponse.response)
            respJson["ChatWindowPopoutEnabled"] = true
            respJson["StatusesDisabled"] = false
            XhrResponse.response = JSON.stringify(respJson)
            
        }
    },
    {
        // Profile privacy
        // This is working because tencent is comparing the result with `ENABLED
        matcher:"/lol-summoner/v1/profile-privacy-enabled",
        preSend: (XhrRequestConfig) => {},
        postSend: (XhrResponse) => {
            XhrResponse.response = "FUCK U TENCENT"
        }
    },
    {
        // Mass disenchant
        matcher: "/lol-loot/v1/mass-disenchant/configuration",
        preSend: (XhrRequestConfig) => {},
        postSend: (XhrResponse) => {
            const respJson = JSON.parse(XhrResponse.response)
            respJson["enabled"] = true
            // I dont know if it's working 
            respJson["maxLootItemsSizeMassCraft"] = "99999"
            XhrResponse.response = JSON.stringify(respJson)
            
        }
    }
]
```

# Hook structure

> The only thing you need to notice is that `preSend` and `postSend` is **NOT OPTIONAL**, if you don't do anything, just keep it blank.

Here we use [Ajax-hook](https://github.com/wendux/ajax-hook) as the hooking dependency.

So check definition about `XhrRequestConfig` and `XhrResponse`  [Here](https://github.com/wendux/ajax-hook/blob/master/index.d.ts) 

```javascript
{
    matcher: "/lol-loot/v1/mass-disenchant/configuration",
    // Keep preSend a blank arrow function but do not delete it
    preSend: (XhrRequestConfig) => {},
    postSend: (XhrResponse) => {
        const respJson = JSON.parse(XhrResponse.response)
        respJson["enabled"] = true
        // I dont know if it's working 
        respJson["maxLootItemsSizeMassCraft"] = "99999"
        XhrResponse.response = JSON.stringify(respJson)

}
```

