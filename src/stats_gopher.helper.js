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
    this.statsGopher.send(this.elementData(e.target, interaction));
  },
  elementData: function (el, interaction) {
    var data = {
      interaction: interaction
    };

    for (var attr in el.dataset) {
      data[attr] = el.dataset[attr];
    }

    var path = [];

    var currentNode = el;

    while (currentNode) {
      if ('key' in currentNode.dataset) {
        path.unshift(currentNode.dataset.key)
      }
      currentNode = currentNode.parentNode;
    }

    data.key = path.join('/');

    var h1 = document.querySelector('h1') || { textContent: '' };

    data.location = window.location.toString();
    data.pageTitle = h1.textContent;
    data.windowTitle = document.title;
    data.text = el.textContent;

    if (el.tagName === 'A') {
      data.href = el.href;
    }

    return data;
  }
}
