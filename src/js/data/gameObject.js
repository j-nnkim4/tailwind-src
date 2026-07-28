var config = __webpack_require__( "./src/js/config.js");

module.exports = function (sid) {
    this.sid = sid;

    this.init = function(x, y, dir, scale, type, data, owner) {
        data = data||{};
        this.sentTo = {};
        this.gridLocations = [];
        this.active = true;
        this.doUpdate = data.doUpdate;
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.xWiggle = 0;
        this.yWiggle = 0;
        this.scale = scale;
        this.type = type;
        this.cachedSprite = null;
        this.id = data.id;
        this.owner = owner;
        this.name = data.name;
        this.isItem = (this.id!=undefined);
        this.group = data.group;
        this.health = data.health;
        this.maxHealth = data.health;
        this.consecutiveBreak = false;
        this.lastDamageTime = 0;
        this.hitter = null;
        this.hitWeapon = null;
        this.nextFireTick = null;
        this.dmgTextTime = 0;
        this.barFill = null;
        this.layer = 2;
        if (this.group != undefined) {
            this.layer = this.group.layer;
        } else if (this.type == 0) {
            this.layer = 3;
        } else if (this.type == 2) {
            this.layer = 0;
        }
        this.cactus = (this.type === 1) * (this.y >= config.desertOffset);
        this.colDiv = data.colDiv||1;
        this.blocker = data.blocker;
        this.ignoreCollision = data.ignoreCollision;
        this.dontGather = data.dontGather;
        this.hideFromEnemy = data.hideFromEnemy;
        this.friction = data.friction;
        this.projDmg = data.projDmg;
        this.dmg = data.dmg;
        this.pDmg = data.pDmg;
        this.pps = data.pps;
        this.zIndex = data.zIndex||0;
        this.turnSpeed = data.turnSpeed;
        this.req = data.req;
        this.trap = data.trap;
        this.healCol = data.healCol;
        this.teleport = data.teleport;
        this.boostSpeed = data.boostSpeed;
        this.projectile = data.projectile;
        this.shootRange = data.shootRange;
        this.shootRate = data.shootRate;
        this.shootCount = this.shootRate;
        this.spawnPoint = data.spawnPoint;
    };

    this.changeHealth = function(amount, doer) {
        this.health += amount;
        return (this.health <= 0);
    };

    this.getScale = function(sM, ig) {
        sM = sM||1;
        return this.scale * ((this.isItem||this.type==2||this.type==3)
                             ?1:(0.6*sM)) * (ig?1:this.colDiv);
    };

    this.visibleToPlayer = function(player) {
        return !(this.hideFromEnemy) || (this.owner && (this.owner == player ||
                                                        (this.owner.team && player.team == this.owner.team)));
    };

    this.update = function(delta) {
        if (this.active) {
            if (this.xWiggle) {
                this.xWiggle *= Math.pow(0.99, delta);
            } if (this.yWiggle) {
                this.yWiggle *= Math.pow(0.99, delta);
            }
            if (this.turnSpeed && !(config.staticMills && /mill/.test(this.name))) {
                this.dir += this.turnSpeed * delta;
            }
        }
    };
};
