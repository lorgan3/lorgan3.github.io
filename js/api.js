'use strict';

/**
 * An api class to handle making requests to the backend.
 * Also see MockApi.
 */
class Api {
    /**
     * @param {?string} appId The app uuid or null to use the default.
     * @param {number} cpuMetric The cpu metric id.
     * @param {number} memoryMetric The memory metric id.
     */
    constructor(appId, cpuMetric, memoryMetric) {
        this.headers = new Headers();
        this.headers.append('Accept', 'application/json');
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');

        if (appId === null) {
            this.appId = '0196891a-fc0e-4849-95d3-530cb0835a45';
            this.cpuMetric = 3238555; // Docker container user mode cpu usage
            this.memoryMetric = 3238560; // Docker container free memory percentage

            this.headers.append('DashboardAuthorization', '80e97d00-6e22-472b-b5a9-c9e3701bfc40');
        } else {
            this.appId = appId;
            this.cpuMetric = cpuMetric;
            this.memoryMetric = memoryMetric;

            this.headers.append('HTTPAuthorization', prompt('HTTPAuthorization for ' + appId));
        }
    }

    /**
     * Fetch all serversgroups from the backend.
     * @return {Promise.<Array.<ServerGroup>>}
     */
    fetchServerGroups() {
        return Promise.all([fetch('https://app.coscale.com/api/v1/app/' + this.appId + '/servergroups/?start=-604800&stop=0&expand=parentId&expand=serverIds', { headers: this.headers }).then(handleErrors).then(response => response.json()).then(json => json.map(data => new ServerGroup(data)))]);
    }

    /**
     * Fetch the data for the cpu and memory metric from the backend.
     * @param {*} pods The pod html objects.
     * @return {*}
     */
    fetchPodData(pods) {
        let subjects = [];
        for (let pod of pods) {
            subjects.push(pod.data.short);
        }

        let now = Math.floor(Date.now() / 1000);
        let data = new URLSearchParams();
        data.append('data', JSON.stringify({
            start: now - 604800,
            stop: now,
            ids: [{
                metricId: this.cpuMetric,
                dimensionsSpecs: [],
                subjects: subjects.join(','),
                viewtype: 'MAX'
            }, {
                metricId: this.memoryMetric,
                dimensionsSpecs: [],
                subjects: subjects.join(','),
                viewtype: 'MAX'
            }]
        }));

        return fetch('https://app.coscale.com/api/v1/app/' + this.appId + '/data/dimension/getCalculated/calculated/?function=summary&mode=last', {
            headers: this.headers,
            method: 'POST',
            body: data
        }).then(handleErrors).then(response => response.json());
    }
}