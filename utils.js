const {getFilePermissions, addWebhook} = require("./handlers");
const {AuthHolderInstance} = require("./auth");
const fs = require('fs');
const {WEBHOOK_SUB_TIMEOUT_MINUTES, NOTIFICATION_URL} = require("./constants");

const SUB_INFO_FILE = './.sub-info.txt';

async function getFileDataForItems(itemsList) {
    const response = {};

    for (let item of itemsList) {
        const meta = await getFilePermissions(AuthHolderInstance.getToken(), item.id);
        const users = meta.value ? meta.value.filter(item => item && item.grantedTo)
            .map(item => JSON.stringify(item.grantedTo.user)) : [];

        response[item.id] = {
            type: item.folder ? 'folder' : 'file',
            name: item.name,
            downloadURL: item['@microsoft.graph.downloadUrl'],
            itemId: item.id,
            driveId: item.parentReference.driveId,
            users
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

async function setupSubscriptionIfRequired() {
    if (process.env.USE_WEBHOOK !== "true") {
        return;
    }

    let createSub = true;

    if (fs.existsSync(SUB_INFO_FILE)) {
        const data = fs.readFileSync(SUB_INFO_FILE);

        if (data) {
            const subTime = new Date(data.toString());
            const now = new Date(Date.now());
            const diffMinutes = (now - subTime) / 1000 / 60;

            if (diffMinutes <= WEBHOOK_SUB_TIMEOUT_MINUTES - 5) {
                console.log("Diff is ", diffMinutes);
                let createSub = false;
            }
        }
    }

    if (createSub) {
        const resp = await addWebhook(AuthHolderInstance.getToken(), NOTIFICATION_URL,
            getNMinutesFromNow(WEBHOOK_SUB_TIMEOUT_MINUTES));
        console.log("Created webhook subscription", resp);

        fs.writeFileSync(SUB_INFO_FILE, new Date(Date.now()).toISOString());
    }
}

module.exports = {
    getFileDataForItems,
    getNMinutesFromNow,
    ChangeLogInstance: new ChangeLog(),
    setupSubscriptionIfRequired
}