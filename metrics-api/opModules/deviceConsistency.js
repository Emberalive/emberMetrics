const {readDevices} = require('./device');
const {readUsers, updateUser} = require('./user');

async function checkDeviceConsistency() {
    const devices = await readDevices();
    const users = await readUsers();
    if (!users || !users.length) return false

    let devicesRemoved = 0;

    for (const user of users) {
        for (const device of user.devices) {
            const exists = devices.some(ud => ud.id === device.id);
            if (!exists) {
                const success = await removeUserDevice(user, device);
                if (success) {
                    console.log(`[ Server - checkDeviceConsistency ] Removed ghost device "${device.name}" from user "${user.username}"`);
                    devicesRemoved++;
                } else {
                    console.log(`[ Server - checkDeviceConsistency ] Failed to remove ghost device "${device.name}" from user "${user.username}"`);
                }
            }
        }
    }
    console.log(`[ Server - checkDeviceConsistency ] Done. Devices removed: ${devicesRemoved}`);
}

async function removeUserDevice(user, device) {
    if (!user || !device) return false

    const updatedDevices = user.devices.filter(d => d.id !== device.id);
    const updatedUser = {
        ...user,
        devices: updatedDevices,
    };

    return await updateUser(user.username, updatedUser);
}

module.exports = {checkDeviceConsistency};