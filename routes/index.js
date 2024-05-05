var express = require('express');
const {getAllFiles, getFilePermissions, addWebhook, getDriveDelta, getFileInfo} = require("../handlers");
const {AuthHolderInstance} = require("../auth");
const {getFileDataForItems, getNMinutesFromNow, ChangeLogInstance} = require("../utils");
var router = express.Router();

/* GET home page. */
// router.get('/', function (req, res, next) {
//     res.render('index', {title: 'Express'});
// });

const AUTH_URL = "https://login.live.com/oauth20_authorize.srf";
const TOKEN_URL = "https://login.live.com/oauth20_token.srf";
const CLIENT_ID = '9639274e-a585-45d1-b2cf-c7549002c817';
const CLIENT_SECRET = 'lwR8Q~e9yonQUr~BkADqCA3VaRTkUG9Kz6yIGbIg';
const HOOK_ENDPOINT = '/od_hook';
const NOTIFICATION_URL = process.env.EXPOSED_URL + HOOK_ENDPOINT;

router.get('/', function (req, res) {
    res.redirect('http://localhost:3003/');
});

router.get('/login', function (req, res) {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: 'http://localhost:3000/auth/callback',
        response_type: 'code',
        scope: ['Files.Read', 'Files.Read.All']
    });

    res.redirect(AUTH_URL + '?' + params);
});

router.get('/auth/callback', function (req, res) {
    const authCode = req.query.code;
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: 'http://localhost:3000/auth/callback',
        client_secret: CLIENT_SECRET,
        code: authCode,
        grant_type: 'authorization_code'
    });

    const response = fetch(TOKEN_URL, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }, method: "POST", body: params
    }).then(resp => resp.json()).then((res_json) => {
        AuthHolderInstance.setToken(res_json.access_token);
        res.redirect('http://localhost:3003/files_view');
    });
});

router.get('/get_all_files', async function (req, res) {
    const accessToken = AuthHolderInstance.getToken();

    if (!accessToken) {
        res.redirect('/login');
    } else {
        console.log("getting drive items");
        const driveItems = await getAllFiles(accessToken);
        console.log(driveItems);
        const resp = await getFileDataForItems(driveItems);

        res.json({
            files: resp
        });
    }
});

router.get('/add_sub', async function (req, res) {
    const resp = await addWebhook(AuthHolderInstance.getToken(), NOTIFICATION_URL, getNMinutesFromNow(60));

    res.json({
        res: resp
    });
});

if (process.env.USE_WEBHOOK === "true") {
    router.post(HOOK_ENDPOINT, async function (req, res) {
        console.log('Got something');
        if (req.query.validationToken) {
            res.send(req.query.validationToken);
        } else {
            if (AuthHolderInstance.getToken()) {
                const driveItems = await getAllFiles(AuthHolderInstance.getToken());
                const fileData = await getFileDataForItems(driveItems);

                ChangeLogInstance.addChanges(fileData);
                console.log("Pushed to file changes", ChangeLogInstance.getLen());
            }
        }
    });
}

const SEND_INTERVAL = 300;

const writeEvent = (res, sseId, data) => {
    res.write(`id: ${sseId}\n`);
    res.write(`data: ${data}\n\n`);
};

router.get('/file_update_stream', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Content-Encoding': 'none',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    });

    const sseId = new Date().toDateString();

    if (process.env.USE_WEBHOOK === "true") {
        setInterval(() => {
            while (ChangeLogInstance.hasChanges()) {
                writeEvent(res, sseId, JSON.stringify({
                    files: ChangeLogInstance.popChange()
                }));

                console.log("Event sent");
            }
        }, SEND_INTERVAL);

    } else {
        setInterval(async () => {
            const driveItems = await getAllFiles(AuthHolderInstance.getToken());
            const resp = await getFileDataForItems(driveItems);

            writeEvent(res, sseId, JSON.stringify({files: resp}));
            console.log("Event sent");
        }, SEND_INTERVAL);
    }

    writeEvent(res, sseId, JSON.stringify({cur_len: ChangeLogInstance.getLen()}));
})
;

module.exports = router;
