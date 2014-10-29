var expect = chai.expect;

describe('StatsGopher.Helper', function() {
  var helper, statsGopher;

  beforeEach(function () {
    statsGopher = {
      send: sinon.spy()
    };
    helper = new StatsGopher.Helper(statsGopher);
  });

  describe('ctor', function() {
    describe('statsGopher', function() {
      it('is assigned to the instance', function () {
        expect(helper.statsGopher).to.equal(statsGopher);
      });
    });
  });
  describe('listenToClicks', function () {
    it('binds trackEvent to window click events', function () {
      helper.trackEvent = sinon.spy();
      helper.listenToClicks();
      var event = new MouseEvent('click', {
        canBubble: true,
        cancelable: true
      });
      window.dispatchEvent(event);
      expect(helper.trackEvent.calledWith(event, 'click')).to.equal(true);
    });
  });
  describe('listenToMousedown', function () {
    it('binds trackEvent to window click events', function () {
      helper.trackEvent = sinon.spy();
      helper.listenToMousedown();
      var event = new MouseEvent('mousedown', {
        canBubble: true,
        cancelable: true
      });
      window.dispatchEvent(event);
      expect(helper.trackEvent.calledWith(event, 'mousedown')).to.equal(true);
    });
  });
  describe('trackEvent(event, interaction)', function () {
    it('extracts and sends event data', function () {
      var data = {}, event = { target: {} };
      helper.collectData = sinon.spy(function () {
        return data;
      });

      helper.trackEvent(event, 'interaction');

      expect(helper.collectData.calledWith(event.target, 'interaction')).to.equal(true);
      expect(helper.statsGopher.send.calledWith(data)).to.equal(true);
    });
  });
  describe('collectData(el, interaction)', function() {
    var data;

    beforeEach(function () {
      var html = document.createElement('HTML');
      html.dataset.key = 'html-key';
      html.innerHTML = '\
        <body>\
          <div data-key="ancestor">\
            <section>\
              <div data-key="leaf-parent">\
                <span data-key="leaf"\
                      data-value="hello-world"\
                      data-another-attribute="another-value"\
                      data-page-title="some-other-title"\
                >target-text</span>\
              </div>\
            </section>\
          </div>\
        </body>';

      var el = html.querySelector('span');

      data = helper.collectData(el, 'click');
    });

    it('includes the page location', function () {
      expect(window.location.toString()).not.to.equal('');
      expect(data.location).to.equal(window.location.toString());
    });
    it('includes the interaction', function () {
      expect(data.interaction).to.equal('click');
    });
    it('includes the page title', function () {
      var h1 = document.querySelector('h1').textContent;
      expect(h1).not.to.equal('');
      expect(!!h1).to.equal(true);
      expect(data.pageTitle).to.equal(h1);
    });
    it('includes the user agent', function () {
      expect(data.userAgent).to.equal(window.navigator.userAgent);
    });
    it('includes the window title', function () {
      expect(data.windowTitle).to.equal(document.title);
    });
    it('includes the text of the target element', function () {
      expect(data.text).to.equal('target-text')
    });
    describe('when the event target element has a data-interaction attribute', function () {
      beforeEach(function () {
        var el = {
          dataset: {
            interaction: 'prod'
          }
        };

        data = helper.collectData(el, 'click');
      });
      it('overrides the interaction parameter', function () {
        expect(data.interaction).to.equal('prod');
      });
    });
    describe('when the target element is an anchor', function() {
      var href;

      beforeEach(function () {
        href = 'http://example.net'

        var el = {
          tagName: 'A',
          href: href,
          textContent: 'some-text',
          dataset: {}
        };

        data = helper.collectData(el, 'click');
      });
      it('includes the href', function () {
        expect(data.href).to.equal(href);
      });
    });
    describe('data attribute collection', function () {
      it('includes any data attributes on the target element', function () {
        expect(data['value']).to.equal('hello-world');
        expect(data['anotherAttribute']).to.equal('another-value');
      });
      describe('when there is a naming collision with predefined data attribute', function () {
        it('disregards the data attribute value', function () {
          expect(data.windowTitle).to.equal(document.title);
        });
      });
      describe('the data-key attribute', function () {
        it('is a path describing all data-key attributes from html to target', function () {
          expect(data.key).to.equal('html-key/ancestor/leaf-parent/leaf');
        });
      });
    });
  });
});
