INSIDE STATS GOPHER....

function StatsGopher () {
  ...
  this.listener = new StatsGopher.Listener();
  ...
}


statsGopher.listener = new StatsGopher.Listener(statsGopher);


StatsGopher.Listener = function () {

}
/*

// Sanitize data
var key = this.key(e.target);
this.handleEvent(data)

*/
StatsGopher.Listener.prototype = {
  listenToClicks: function (selector) {
    $(selector || window).click(this.trackEvent.bind(this));
  },
  eventToData: function (e) {
    var data = {};
    data.key = $(e.target).ancestors().mapToKey...

    if (e.target.tagName === "A") {
      data.location = e.targe.href;
    }

    // tagName
    // innerText

    // if its a data
    // href
    return data;
  },
  trackEvent: function (e) {
    var data = this.eventToData(e);
    this.statsGopher.send(data);
  },
  listenToForm: function (selector) {
    $(selector).submit(function (e) {
      e.preventDefault();
      // report sta
    }.bind(this));
  }
}


decides which dom elements to listen to
-------
listens to dom elements
creates data objects to send
SG.send




CLIENT APP SETUP -----------

/*
  responsible for posting stats
*/
window.statsGopher = new StatsGopher({
  endpoint: 'http://stats-gopher.herokuapp.com',
  listener: false
});

$(function () {
  myapp.listen();
});

myapp = {
  listen: function () {

    statsGopher.listener().listenToClicks(window);
    statsGopher.listener().listenToForm('#my_form');
  }
}

statsGopher.trackClick(e)


----------------
