var expect = chai.expect;

describe('StatsGopher.Listener', function() {
  var listener, statsGopher;

  beforeEach(function () {
    statsGopher = {
      send: sinon.spy()
    };
    listener = new StatsGopher.Listener(statsGopher);
  });

  describe('ctor', function() {
    describe('statsGopher', function() {
      it('is assigned to the instance', function () {
        expect(listener.statsGopher).to.equal(statsGopher);
      });
    });
  });

  describe('listenToClicks', function () {
    // listenToClicks: function (selector) {
    //   $(selector || window).click(this.trackEvent.bind(this));
    // },

  })
});
