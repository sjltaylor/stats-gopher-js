StatsGopher.PresenceMonitor = function PresenceMonitor (opts) {
  opts = opts || {};
  this.statsGopher = opts.statsGopher;
  this.key = opts.key;
  this.send = this.executeNextSend;
  this.paused = false;
}

StatsGopher.PresenceMonitor.prototype = {
  ignoreNextSend: function () {
  },
  queueNextSend: function () {
    this.request.done(function () {
      this.send()
    }.bind(this))
    this.send = this.ignoreNextSend
  },
  executeNextSend: function () {
    var executeNextSend = function () {
      this.send = this.executeNextSend
    }.bind(this);

    if (this.paused) return;

    this.request = this.statsGopher.send({
      code: this.code,
      key: this.key
    }).done(executeNextSend).fail(executeNextSend);

    this.send = this.queueNextSend
  },
  pause: function () {
    this.paused = true
  },
  resume: function () {
    this.paused = false
  }
}

StatsGopher.Heartbeat = function (opts) {
  StatsGopher.PresenceMonitor.apply(this, arguments)
  this.timeout = (typeof opts.timeout) === 'number' ? opts.timeout : 10000;
}
StatsGopher.Heartbeat.prototype = new StatsGopher.PresenceMonitor()
StatsGopher.Heartbeat.prototype.code = 'heartbeat'
StatsGopher.Heartbeat.prototype.start = function () {
  this.send()
  setTimeout(this.start.bind(this), 10000)
}

StatsGopher.UserActivity = function () {
  StatsGopher.PresenceMonitor.apply(this, arguments)
}
StatsGopher.UserActivity.prototype = new StatsGopher.PresenceMonitor()
StatsGopher.UserActivity.prototype.code = 'user-activity'
StatsGopher.UserActivity.prototype.listen = function () {
  var events = [
    'resize',
    'click',
    'mousedown',
    'scroll',
    'mousemove',
    'keydown'
  ];

  events.forEach(function (eventName) {
    window.addEventListener(eventName, function () {
      this.send();
    }.bind(this))
  }.bind(this));
}
