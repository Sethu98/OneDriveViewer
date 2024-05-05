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
            users: meta.value ? meta.value.filter(item => item && item.grantedTo).map(item => item.grantedTo.user.id): []
        }
    }

    return response;
}

function getNMinutesFromNow(n) {
    const now = new Date(Date.now());
    now.setMinutes(now.getMinutes() + n);

    return now.toISOString();
}

class ChangeLog {
    changes = [];

    addChanges(items) {
        this.changes.push(items);
    }

    hasChanges() {
        return this.changes.length !== 0;
    }

    popChange() {
        return this.changes.pop();
    }

    getLen() {
        return this.changes.length;
    }
}

module.exports = {
    getFileDataForItems,
    getNMinutesFromNow,
    ChangeLogInstance: new ChangeLog()
}