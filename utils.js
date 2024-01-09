const channelEdit = {
    count: {},
    firstEditTime: {},
    increase(channelId) {
        if (this.getLeftTime(channelId) <= 0) {
            this.count[channelId] = 1;
            this.firstEditTime[channelId] = Date.now();
        } else {
            this.count[channelId]++;
        }
    },
    getLeftTime(channelId) {
        if (!this.firstEditTime[channelId]) {
            return 0;
        }

        return 10 * 60 * 1000 - (Date.now() - this.firstEditTime[channelId]);
    },
};

const usersRedirected = {};

module.exports = {
    channelEdit,
    usersRedirected,
};