const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const Instagram = require('./instagram.js')
const { head } = require('request')

let instagram = new Instagram();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

function setInstagramSession() {
    var headers = {
        'User-Agent': process.env.USER_AGENT,
        'x-csrftoken': process.env.IG_CSRF,
        'x-ig-app-id': process.env.IG_APPID,
        'x-ig-www-claim': process.env.IG_CLAIM,
        'Cookie': process.env.IG_COOKIE,
        'x-instagram-ajax': process.env.IG_AJAX,
        'x-requested-with': 'XMLHttpRequest',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'accept': '*/*',
        'x-asbd-id': '198387',
        'sec-fetch-site': 'same-origin',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-ch-prefers-color-scheme': 'dark',
        'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'viewport-width': '811'
    }

    instagram.setHeaders(headers);
}

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

function log(str) {
    console.log(str);
}

function unixTimestamp() {
    return Math.floor(
        Date.now() / 1000
    )
}

app.post('/ig/profile', (req, res) => {

    const { data, config } = req.body;

    if (req.header("Bot-Public")) {
        setInstagramSession();
    } else {
        instagram.setHeaders(config.session.instagram.headers);
    }

    (async () => {
        var result = await instagram.getProfile(data.username);
        res.send(result);
    })();
})

app.post('/ig/follow', (req, res) => {

    const { data, config } = req.body;

    if (req.header("Bot-Public") && process.env.LOCAL_SESSION == 1) {
        setInstagramSession();
    } else {
        instagram.setHeaders(config.session.instagram.headers);
    }

    (async () => {
        var result = await instagram.follow(data.username);
        res.send(result);
    })();
})

app.post('/ig/unfollow', (req, res) => {

    const { data, config } = req.body;

    if (req.header("Bot-Public") && process.env.LOCAL_SESSION == 1) {
        setInstagramSession();
    } else {
        instagram.setHeaders(config.session.instagram.headers);
    }

    (async () => {
        var result = await instagram.unfollow(data.username);
        res.send(result);
    })();
})

app.post('/ig/remove', (req, res) => {

    const { data, config } = req.body;

    if (req.header("Bot-Public") && process.env.LOCAL_SESSION == 1) {
        setInstagramSession();
    } else {
        instagram.setHeaders(config.session.instagram.headers);
    }

    (async () => {
        var result = await instagram.remove(data.username);
        res.send(result);
    })();
})

app.post('/ig/followers', (req, res) => {

    const { data, config } = req.body;

    if (req.header("Bot-Public") && process.env.LOCAL_SESSION == 1) {
        setInstagramSession();
    } else {
        instagram.setHeaders(config.session.instagram.headers);
    }

    (async () => {
        if(data.query) {
            res.send(await instagram.getFollowersByQuery(data.username,data.next,data.total));
        } else {
            res.send(await instagram.getFollowers(data.username,data.next,data.total));
        }
    })();
})

app.post('/ig/myfollowers', (req, res) => {

    const { data, config } = req.body;

    if (req.header("Bot-Public") && process.env.LOCAL_SESSION == 1) {
        setInstagramSession();
    } else {
        instagram.setHeaders(config.session.instagram.headers);
    }

    (async () => {
        var result = await instagram.getMyFollowers();
        res.send(result);
    })();
})

app.post('/ig/followings', (req, res) => {

    const { data, config } = req.body;

    if (req.header("Bot-Public") && process.env.LOCAL_SESSION == 1) {
        setInstagramSession();
    } else {
        instagram.setHeaders(config.session.instagram.headers);
    }

    (async () => {
        if(data.query) {
            res.send(await instagram.getFollowingsByQuery(data.username,data.next,data.total));
        } else {
            res.send(await instagram.getFollowings(data.username,data.next,data.total));
        }
    })();
})

app.post('/ig/usermedia', (req, res) => {

    const { data, config } = req.body;

    if (req.header("Bot-Public") && process.env.LOCAL_SESSION == 1) {
        setInstagramSession();
    } else {
        instagram.setHeaders(config.session.instagram.headers);
    }

    (async () => {
        if(data.query) {
            res.send(await instagram.getUserMediaByQuery(data.username,data.next,data.total));
        } else {
            res.send(await instagram.getUserMedia(data.username,data.next,data.total));
        }
    })();
})

app.post('/ig/requests', (req, res) => {

    const { data, config } = req.body;

    if (req.header("Bot-Public") && process.env.LOCAL_SESSION == 1) {
        setInstagramSession();
    } else {
        instagram.setHeaders(config.session.instagram.headers);
    }

    (async () => {
        var result = await instagram.getFollowRequest(data.next, data.total);
        res.send(result);
    })();
})

app.post('/ig/thread', (req, res) => {

    const { data, config } = req.body;

    if (req.header("Bot-Public") && process.env.LOCAL_SESSION == 1) {
        setInstagramSession();
    } else {
        instagram.setHeaders(config.session.instagram.headers);
    }

    (async () => {
        var result = await instagram.getThread(data.limit, data.messageLimit,data.cursor);
        res.send(result);
    })();
})

app.post('/ig/media', (req, res) => {

    const { data, config } = req.body;

    if (req.header("Bot-Public") && process.env.LOCAL_SESSION == 1) {
        setInstagramSession();
    } else {
        instagram.setHeaders(config.session.instagram.headers);
    }

    (async () => {
        var result = await instagram.getMedia(data.url);
        res.send(result);
    })();
})

console.log(`Running on port ${port}`)

if (process.env.NODE_ENV == "production") {
    app.listen()
} else {
    app.listen(port, () => { })
}

