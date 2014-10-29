StatsGopher.Helper = function Helper (statsGopher) {
  this.statsGopher = statsGopher;
}

StatsGopher.Helper.prototype = {
  listenToClicks: function (selector) {
    window.addEventListener('click', function (e) {
      this.trackEvent(e, 'click');
    }.bind(this));
  },
  listenToMousedown: function (selector) {
    window.addEventListener('mousedown', function (e) {
      this.trackEvent(e, 'mousedown');
    }.bind(this));
  },
  trackEvent: function (e, interaction) {
    this.statsGopher.send(this.collectData(e.target, interaction));
  },
  collectData: function (el, interaction) {
    var data = {
      interaction: interaction
    };

    for (var attr in el.dataset) {
      data[attr] = el.dataset[attr];
    }

    var path = [];

    var currentNode = el;

    while (currentNode && currentNode.tagName) {
      if ('key' in currentNode.dataset) {
        path.unshift(currentNode.dataset.key)
      }

      if (currentNode.tagName === 'A') {
        data.href = currentNode.href;
      }

      currentNode = currentNode.parentNode;
    }

    data.key = path.join('/');

    var h1 = document.querySelector('h1') || { textContent: '' };

    data.location = window.location.toString();
    data.pageTitle = h1.textContent;
    data.windowTitle = document.title;
    data.text = el.textContent;
    data.userAgent = window.navigator.userAgent;

    return data;
  }
}
