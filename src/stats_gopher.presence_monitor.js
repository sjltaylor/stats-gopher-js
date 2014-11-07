StatsGopher.PresenceMonitor = function PresenceMonitor (statsGopher) {
  this.initialize(statsGopher)
}

StatsGopher.PresenceMonitor.prototype = {
  initialize: function (statsGopher) {
    this.statsGopher = statsGopher;
    this.send = this.executeNextSend;
  },
  log: function () {
    if (this.options.log) {
      console.log.apply(console, arguments);
    }
  },
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

    this.request = this.statsGopher.send({
      code: this.code
    }).done(executeNextSend).fail(executeNextSend);

    this.send = this.queueNextSend
  }
}

StatsGopher.Heartbeat = StatsGopher.PresenceMonitor
StatsGopher.Heartbeat.prototype = new StatsGopher.PresenceMonitor()
StatsGopher.Heartbeat.prototype.code = 'heartbeat'
StatsGopher.Heartbeat.prototype.start = function () {
  this.send()
  setTimeout(this.start.bind(this), 10000)
}

StatsGopher.UserActivity = StatsGopher.PresenceMonitor
StatsGopher.UserActivity.prototype = new StatsGopher.PresenceMonitor()
StatsGopher.UserActivity.prototype.code = 'user-activity'
StatsGopher.UserActivity.prototype.listen = function () {
  var events = [
    'pageshow',
    'popstate',
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
