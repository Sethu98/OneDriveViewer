var express = require('express');
const {getAllFiles, getFilePermissions, addWebhook, getDriveDelta, getFileInfo} = require("../handlers");
const {AuthHolderInstance} = require("../auth");
const {getFileDataForItems, getNMinutesFromNow} = require("../utils");
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
        },
        method: "POST",
        body: params
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
        const driveItems = await getAllFiles(accessToken);
        const resp = await getFileDataForItems(driveItems);
        console.log(resp);

        res.json({
            files: resp
        });
    }
});

router.get('/file_meta', async function (req, res) {
    const accessToken = AuthHolderInstance.getToken();

    if (!accessToken) {
        res.redirect('/login');
    } else {
        const driveItems = await getAllFiles(accessToken);
        const files = driveItems.map(item => item.name);

        res.json({
            files,
            driveItems
        })
    }
});

router.get('/add_sub', async function (req, res) {
    const resp = await addWebhook(AuthHolderInstance.getToken(), NOTIFICATION_URL, getNMinutesFromNow(10));

    res.json({
        res: resp
    });
});

router.post(HOOK_ENDPOINT, async function (req, res) {
    console.log('Got something');
    if (req.query.validationToken) {
        res.send(req.query.validationToken);
    } else {
        console.log(req.body);
        console.log(req.body.resourceData);

        const delta = await getDriveDelta(AuthHolderInstance.getToken());
        const changedIds = delta.value.map(item => item.id);
        // Looks like all items come in this response
        // In the interest of time, I'm just gonna fetch info for all of these and send to client

        //
        // for(let itemId of changedIds) {
        //     const meta = await getFilePermissions(AuthHolderInstance.getToken(), null, itemId);
        //     console.log(itemId, meta.value ? meta.value.map(item => item.grantedTo.user.id): []);
        // }

        // console.log('Changed Ids', changedIds);
    }
});

module.exports = router;
