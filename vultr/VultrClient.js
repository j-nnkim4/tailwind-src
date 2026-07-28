function VultrClient(baseUrl, devPort, lobbySize, lobbySpread, rawIPs) {
    this.debugLog = false;

    this.baseUrl = baseUrl;
    this.lobbySize = lobbySize;
    this.devPort = devPort;
    this.lobbySpread = lobbySpread;
    this.rawIPs = !!rawIPs;

    this.server = undefined;
    this.gameIndex = undefined;
    this.password = undefined;
    this.servers = {};
    this.pingRefreshInterval = undefined;

    this.callback = undefined;
    this.errorCallback = undefined;
    this.onPingUpdate = undefined;
}

VultrClient.prototype.regionInfo = {
    0: { name: "Local", latitude: 0, longitude: 0 },
    "us-east": { name: "Miami", latitude: 40.1393329, longitude: -75.8521818 },
    "miami": { name: "Miami", latitude: 40.1393329, longitude: -75.8521818 },
    "us-west": { name: "Silicon Valley", latitude: 47.6149942, longitude: -122.4759879 },
    "siliconvalley": { name: "Silicon Valley", latitude: 47.6149942, longitude: -122.4759879 },
    "gb": { name: "London", latitude: 51.5283063, longitude: -0.382486 },
    "london": { name: "London", latitude: 51.5283063, longitude: -0.382486 },
    "eu-west": { name: "Frankfurt", latitude: 50.1211273, longitude: 8.496137 },
    "frankfurt": { name: "Frankfurt", latitude: 50.1211273, longitude: 8.496137 },
    "au": { name: "Sydney", latitude: -33.8479715, longitude: 150.651084 },
    "sydney": { name: "Sydney", latitude: -33.8479715, longitude: 150.651084 },
    "saopaulo": { name: "Sao Paulo", latitude: 23.5558, longitude: 46.6396 },
    "sg": { name: "Singapore", latitude: 1.3147268, longitude: 103.7065876 },
    "singapore": { name: "Singapore", latitude: 1.3147268, longitude: 103.7065876 }
};

VultrClient.prototype.start = function(serverKey, callback, errorCallback, skipLookup) {
    this.callback = callback;
    this.errorCallback = errorCallback;

    if (skipLookup) return callback();

    var query = this.parseServerQuery(serverKey);
    if (query && query.length > 0 && query[0] != null && query[1] != null) {
        this.log("Found server in query.");
        this.password = query[2];
        this.connect(query[0], query[1], undefined);
    } else {
        this.errorCallback("Unable to find server");
    }
};

VultrClient.prototype.parseServerQuery = function(serverKey) {
    var params = new URLSearchParams(location.search);
    var raw = serverKey || params.get("server");
    if (typeof raw != "string") return [];
    var split = raw.split(":");
    return [split[0], split[1], params.get("password")];
};

VultrClient.prototype.findServer = function(region, name) {
    var list = this.servers[region];
    if (!list) {
        console.warn("Could not find region " + region + ".");
        return null;
    }
    for (var i = 0; i < list.length; i++) {
        if (list[i].name === name) return list[i];
    }
    console.warn("Could not find server in region " + region + " with serverName " + name + ".");
    return null;
};

VultrClient.prototype.connect = function(region, name, gameIndex) {
    if (this.connected) return;
    var server = this.findServer(region, name);
    if (server == null) {
        this.errorCallback("Failed to find server for region " + region + " and serverName " + name);
        return;
    }
    this.log("Connecting to server", server);
    if (server.playerCount >= server.playerCapacity) {
        this.errorCallback("Server is already full.");
        return;
    }
    window.history.replaceState(document.title, document.title, this.generateHref(region, name, this.password));
    this.server = server;
    this.gameIndex = gameIndex;
    this.log("Connecting to " + this.serverAddress(server) + ":" + this.serverPort(server));
    if (this.pingRefreshInterval) {
        clearInterval(this.pingRefreshInterval);
        this.pingRefreshInterval = undefined;
    }
    this.callback(this.serverAddress(server), this.serverPort(server), gameIndex);
};

VultrClient.prototype.switchServer = function(region, name) {
    this.switchingServers = true;
    window.location.href = this.generateHref(region, name, null);
};

VultrClient.prototype.generateHref = function(region, name, password) {
    var href = window.location.href.split("?")[0] + "?server=" + region + ":" + name;
    if (password) {
        href += "&password=" + encodeURIComponent(password);
    }
    return href;
};

VultrClient.prototype.serverAddress = function(server) {
    return server.region == 0 ? "localhost" : server.key + "." + server.region + "." + this.baseUrl;
};

VultrClient.prototype.serverPort = function(server) {
    return server.port;
};

VultrClient.prototype.processServers = function(serverList) {
    var _this = this;

    if (this.pingRefreshInterval) {
        clearInterval(this.pingRefreshInterval);
        this.pingRefreshInterval = undefined;
    }

    var servers = {};
    for (var i = 0; i < serverList.length; i++) {
        var server = serverList[i];
        server.pings = [];
        if (!servers[server.region]) {
            servers[server.region] = [];
        }
        servers[server.region].push(server);
    }
    for (var region in servers) {
        servers[region].sort(function(a, b) {
            return b.playerCount - a.playerCount;
        });
    }
    this.servers = servers;

    var query = this.parseServerQuery(null);
    var preSelected = null;
    if (query && query.length > 0 && query[0] != null && query[1] != null) {
        preSelected = this.findServer(query[0], query[1]);
        if (preSelected) {
            preSelected.selected = true;
            this.password = query[2];
        }
    }

    function pingRegion(region) {
        var list = _this.servers[region];
        if (!list || !list.length) return Promise.resolve();
        var target = list[0];
        var port = _this.serverPort(target);
        var pingUrl = "https://" + _this.serverAddress(target) + (port ? ":" + port : "") + "/ping";
        var started = Date.now();
        var once = false;
        var record = function(how) {
            if (once) return; once = true;
            var elapsed = Date.now() - started;
            for (var i = 0; i < list.length; i++) {
                var server = list[i];
                server.pings.push(elapsed);
                if (server.pings.length > 10) server.pings.shift();
                var sum = 0;
                for (var j = 0; j < server.pings.length; j++) sum += server.pings[j];
                server.ping = Math.floor(sum / server.pings.length);
            }
            if (_this.onPingUpdate) _this.onPingUpdate();
        };
        var img = new Image();
        img.onload = function() { record("load"); };
        img.onerror = function() { record("err"); };
        img.src = pingUrl + "?t=" + started;
        return new Promise(function(resolve) { setTimeout(resolve, 300); });
    }
    function pingAll() {
        var jobs = [];
        for (var region in _this.servers) jobs.push(pingRegion(region));
        return Promise.all(jobs).then(function() {
            if (_this.onPingUpdate) {
                _this.onPingUpdate();
            }
        });
    }

    return pingAll().then(pingAll).then(function() {
        if (!preSelected) {
            var best = _this.pickBestServer();
            if (best) {
                best.selected = true;
                window.history.replaceState(document.title, document.title,
                                            _this.generateHref(best.region, best.name, _this.password));
            }
        }
        if (_this.onPingUpdate) {
            _this.onPingUpdate();
        }
        _this.pingRefreshInterval = setInterval(pingAll, 5000);
    });
};

VultrClient.prototype.pickBestServer = function() {
    var candidates = [];
    for (var region in this.servers) {
        var list = this.servers[region];
        for (var i = 0; i < list.length; i++) {
            if (list[i].playerCount !== list[i].playerCapacity) {
                candidates.push(list[i]);
            }
        }
    }
    if (!candidates.length) {
        for (var fallbackRegion in this.servers) {
            if (this.servers[fallbackRegion].length) return this.servers[fallbackRegion][0];
        }
        return null;
    }
    candidates.sort(function(a, b) {
        var aPing = a.ping == undefined ? 99999 : a.ping;
        var bPing = b.ping == undefined ? 99999 : b.ping;
        if (aPing !== bPing) return aPing - bPing;
        return b.playerCount - a.playerCount;
    });
    return candidates[0];
};

VultrClient.prototype.log = function() {
    if (this.debugLog) {
        return console.log.apply(undefined, arguments);
    } else if (console.verbose) {
        return console.verbose.apply(undefined, arguments);
    }
};

module.exports = VultrClient;
