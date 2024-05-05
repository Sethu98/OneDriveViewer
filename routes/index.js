var express = require('express');
const {getAllFiles, getFileMetadata} = require("../handlers");
const {AuthHolderInstance} = require("../auth");
var router = express.Router();

/* GET home page. */
// router.get('/', function (req, res, next) {
//     res.render('index', {title: 'Express'});
// });

const AUTH_URL = "https://login.live.com/oauth20_authorize.srf";
const TOKEN_URL = "https://login.live.com/oauth20_token.srf";
const CLIENT_ID = '9639274e-a585-45d1-b2cf-c7549002c817';
const CLIENT_SECRET = 'lwR8Q~e9yonQUr~BkADqCA3VaRTkUG9Kz6yIGbIg';

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
        res.redirect('http://localhost:3003/');
    });
});

router.get('/get_all_files', async function (req, res) {
    const accessToken = AuthHolderInstance.getToken();

    if (!accessToken) {
        res.redirect('/login');
    } else {
        const driveItems = await getAllFiles(accessToken);
        console.log(driveItems);
        const response = [];
        const downloadURLS = [];
        for(let item of driveItems) {
            const meta = await getFileMetadata(accessToken, item.parentReference.driveId, item.id);

            response.push({
                type: item.folder ? 'folder' : 'file',
                name: item.name,
                downloadURL: item['@microsoft.graph.downloadUrl'],
                itemId: item.id,
                driveId: item.parentReference.driveId,
                users: meta.value
            });
        }

        res.json({
            files: response
        })
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

module.exports = router;
