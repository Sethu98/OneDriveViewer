const {getFilePermissions} = require("./handlers");
const {AuthHolderInstance} = require("./auth");

async function getFileDataForItems(itemsList) {
    const response = {};

    for (let item of itemsList) {
        const meta = await getFilePermissions(AuthHolderInstance.getToken(), item.id);

        response[item.id] = {
            type: item.folder ? 'folder' : 'file',
            name: item.name,
            downloadURL: item['@microsoft.graph.downloadUrl'],
            itemId: item.id,
            driveId: item.parentReference.driveId,
            users: meta.value.map(item => item.grantedTo.user.id)
        }
    }

    return response;
}

function getNMinutesFromNow(n) {
    const now = new Date(Date.now());
    now.setMinutes(now.getMinutes() + n);

    return now.toISOString();
}

module.exports = {
    getFileDataForItems,
    getNMinutesFromNow
}