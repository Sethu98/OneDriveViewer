const oneDriveAPI = require("onedrive-api")
const {Auth} = require('./auth.js');


async function getAllFiles(accessToken, itemId) {
    return await oneDriveAPI.items
        .listChildren({
            accessToken,
            itemId,
            drive: "me", // 'me' | 'user' | 'drive' | 'group' | 'site'
            driveId: "", // BLANK | {user_id} | {drive_id} | {group_id} | {sharepoint_site_id}
        })
        .then(resp => resp.value);
}


const GRAPH_API_URL = 'https://graph.microsoft.com/v1.0';
// const getItemPermissionsEndpoint = (driveId, itemId) =>
//     `/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(itemId)}/permissions`;
const getItemPermissionsEndpoint = (driveId, itemId) =>
    `/me/drive/items/${encodeURIComponent(itemId)}/permissions`;

async function getFilePermissions(accessToken, driveId, itemId) {
    const url = GRAPH_API_URL + getItemPermissionsEndpoint(driveId, itemId);

    return await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        method: "GET"
    }).then(res => res.json()).then(res => {
        // console.log(res);
        return res;
    });
}

async function addWebhook(accessToken, notificationUrl, expirationDateTime) {
    const params = {
        "changeType": "updated",
        notificationUrl,
        "resource": "/me/drive/root",
        expirationDateTime,
        "clientState": "client-specific string"
    }

    console.log(params);

    return await fetch(GRAPH_API_URL + '/subscriptions', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": 'application/json'
        },
        method: "POST",
        body: JSON.stringify(params)
    }).then(res => res.json()).then(res => {
        console.log(res);
        return res;
    });
}

async function getDriveDelta(accessToken) {
    return await fetch(GRAPH_API_URL + '/me/drive/root/delta', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        method: "GET"
    }).then(res => res.json()).then(res => {
        return res;
    });
}

module.exports = {
    getAllFiles,
    getFilePermissions,
    addWebhook,
    getDriveDelta
}