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
const getItemPermissionsEndpoint = (driveId, itemId) =>
    `/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(itemId)}/permissions`;

async function getFileMetadata(accessToken, driveId, itemId) {
    console.log(driveId, itemId);
    const url = GRAPH_API_URL + getItemPermissionsEndpoint(driveId, itemId);
    console.log(url);

    return await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        method: "GET"
    }).then(res => res.json()).then(res => {
        console.log(res);
        return res;
    });
}

module.exports = {
    getAllFiles,
    getFileMetadata
}