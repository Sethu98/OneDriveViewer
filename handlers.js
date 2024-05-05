const oneDriveAPI = require("onedrive-api")


const GRAPH_API_URL = 'https://graph.microsoft.com/v1.0';
const getItemEndpoint = itemId => GRAPH_API_URL + `/me/drive/items/${encodeURIComponent(itemId)}`;
const getItemPermissionsEndpoint = itemId => getItemEndpoint(itemId) + '/permissions';

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


async function getFileInfo(accessToken, itemId) {
    const url = getItemEndpoint(itemId);

    return await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        method: "GET"
    }).then(res => res.json()).then(res => {
        console.log('file info', res);
        return res;
    });
}

async function getFilePermissions(accessToken, itemId) {
    const url = getItemPermissionsEndpoint(itemId);

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

    return await fetch(GRAPH_API_URL + '/subscriptions', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": 'application/json'
        },
        method: "POST",
        body: JSON.stringify(params)
    }).then(res => res.json()).then(res => {
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
    getFileInfo,
    getFilePermissions,
    getDriveDelta,
    addWebhook
}