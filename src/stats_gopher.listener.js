function Listener (statsGopher) {
  this.statsGopher = statsGopher;
}

Listener.prototype = {
  listenToClicks: function (selector) {
    //document.querySelectorAll
  }
}

var StatsGopher = require('stats_gopher').StatsGopher;
StatsGopher.Listener = Listener
