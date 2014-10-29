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

    var path = [], currentNode = el;

    while (currentNode && currentNode.tagName) {
      path.unshift(currentNode);
      currentNode = currentNode.parentNode;
    }

    var keys = [];

    path.forEach(function (node) {
      if ('key' in node.dataset) {
        keys.push(node.dataset.key);
      }

      if (node.tagName === 'A') {
        data.href = node.href;
      }

      for (var attr in node.dataset) {
        data[attr] = node.dataset[attr];
      }
    });

    data.key = keys.join('/');

    var h1 = document.querySelector('h1') || { textContent: '' };

    data.location = window.location.toString();
    data.pageTitle = h1.textContent;
    data.windowTitle = document.title;
    data.text = el.textContent;
    data.userAgent = window.navigator.userAgent;

    return data;
  }
}
