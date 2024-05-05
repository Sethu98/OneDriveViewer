const oneDriveAPI = require("onedrive-api")
const {Auth} = require('./auth.js');


async function getAllFiles(token) {
    const resp = await oneDriveAPI.items
        .listChildren({
            accessToken: token,
            itemId: "root",
            drive: "me", // 'me' | 'user' | 'drive' | 'group' | 'site'
            driveId: "", // BLANK | {user_id} | {drive_id} | {group_id} | {sharepoint_site_id}
        })
        .then(resp => resp.value);

    return resp;
}

module.exports = {
    getAllFiles
}