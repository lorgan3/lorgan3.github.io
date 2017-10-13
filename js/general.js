'use strict';

function log() {
    console.log([].slice.call(arguments));
};

function handleErrors(response) {
    if (response.ok === false) {
        throw 'Error while fetching data.';
    }
    return response;
}

let models = {};

/**
 * Simplified implementation of the CoScale model with some ES6 sugar.
 * Actually it's all ES6 sugar.
 */
class CsModel {
    static get key() {
        return 'CsModel';
    }

    constructor(key, data) {
        this.key_ = CsModel.key + key;

        if (data instanceof CsModel) {
            this.data = data.data;
        } else {
            this.data = data || {};
        }

        this.cache();
    }

    cache() {
        if (models[this.key_] === undefined) {
            models[this.key_] = new Map();
        }

        var model = models[this.key_][this.id];
        if (model === undefined) {
            models[this.key_].set(this.id, this);
        } else {
            Object.assign(model, this);
        }
    }

    get id() {
        return this.data.id;
    }

    get parent() {
        return models[this.key_].get(this.data.parentId);
    }

    get type() {
        return this.data.type;
    }

    get name() {
        return this.data.name;
    }

    static get all() {
        return models[this.key];
    }

    static get(id) {
        if (models[this.key] === undefined) {
            return null;
        }

        return models[this.key].get(id);
    }
}

class Server extends CsModel {
    static get key() {
        return super.key + '.Server';
    }

    constructor(data) {
        super('.Server', data);
    }

    get short() {
        return 's' + this.id;
    }
}

class ServerGroup extends CsModel {
    static get key() {
        return super.key + '.ServerGroup';
    }

    constructor(data) {
        super('.ServerGroup', data);
    }

    get serverGroups() {
        if (this.serverGroups_ === undefined) {
            this.serverGroups_ = [];
            for (let group of ServerGroup.all.values()) {
                if (group.parent === this) {
                    this.serverGroups_.push(group);
                }
            }
        }
        return this.serverGroups_;
    }

    get servers() {
        if (this.servers_ === undefined) {
            this.servers_ = [];
            for (let id of this.data.serverIds) {
                let server = Server.get(id);
                if (server !== undefined) {
                    this.servers_.push(server);
                }
            }
        }
        return this.servers_;
    }

    get short() {
        return 'g' + this.id;
    }

    static getRoot() {
        for (let group of this.all.values()) {
            if (group.type === 'Kubernetes') {
                return new Kubernetes(group);
            }
        }
        return null;
    }

    static getByType(type) {
        let groups = [];
        for (let group of this.all.values()) {
            if (group.type === type) {
                groups.push(group);
            }
        }
        return groups;
    }
}

class Kubernetes extends ServerGroup {
    get namespaces() {
        if (this.namespaces_ === undefined) {
            this.namespaces_ = [];
            for (let group of this.serverGroups) {
                if (group.type !== 'Nodes') {
                    this.namespaces_.push(new Namespace(group));
                }
            }
        }
        return this.namespaces_;
    }
}

class Namespace extends ServerGroup {
    get services() {
        if (this.services_ === undefined) {
            this.services_ = this.getGroupsOfType_('Services');
        }
        return this.services_;
    }

    get replicationControllers() {
        if (this.replicationControllers_ === undefined) {
            this.replicationControllers_ = this.getGroupsOfType_('Replication controllers');
        }
        return this.replicationControllers_;
    }

    get daemonSets() {
        if (this.daemonSets_ === undefined) {
            this.daemonSets_ = this.getGroupsOfType_('Daemon sets');
        }
        return this.daemonSets_;
    }

    get replicaSets() {
        if (this.replicaSets_ === undefined) {
            this.replicaSets_ = this.getGroupsOfType_('Replica sets');
        }
        return this.replicaSets_;
    }

    get statefulSets() {
        if (this.statefulSets_ === undefined) {
            this.statefulSets_ = this.getGroupsOfType_('Stateful sets');
        }
        return this.statefulSets_;
    }

    get deployments() {
        if (this.deployments_ === undefined) {
            this.deployments_ = this.getGroupsOfType_('Deployments');
        }
        return this.deployments_;
    }

    get systemContainers() {
        if (this.systemContainers_ === undefined) {
            this.systemContainers_ = this.getGroupsOfType_('System containers');
        }
        return this.systemContainers_;
    }

    get groups() {
        return [this.services, this.replicationControllers, this.daemonSets, this.replicaSets, this.statefulSets, this.deployments, this.systemContainers];
    }

    getGroupsOfType_(type) {
        for (let group of this.serverGroups) {
            if (group.type === type) {
                return group.serverGroups;
            }
        }
        return null;
    }
}

/**
 * Simplified implementation of the subject spec.
 */
class SubjectSpec {
    constructor(spec) {
        this.servers_ = [];
        this.serverGroups_ = [];

        let re = /([gs])(\d+)|a/g;
        let m;
        while (m = re.exec(spec)) {
            switch (m[1]) {
                case 's':
                    this.servers_.push(m[2]);
                    break;
                case 'g':
                    this.serverGroups_.push(m[2]);
                    break;
                default:
                // The application?
            }
        }
    }

    get servers() {
        return this.servers_.map(id => Server.get(Number(id)));
    }

    get serverGroups() {
        return this.serverGroups_.map(id => ServerGroup.get(Number(id)));
    }

    get subjects() {
        return this.servers.concat(this.servergroups);
    }
}