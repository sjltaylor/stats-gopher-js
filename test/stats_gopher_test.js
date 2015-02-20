var expect = chai.expect;

describe('StatsGopher', function() {
  function catchError(fn) {
    try {
      fn()
    } catch (e) {
      return e.toString()
    }
  }

  function SpyDeferred () {
    var returnSelf = function () { return this }.bind(this)
    this.reject = sinon.spy(returnSelf)
    this.fail = sinon.spy(returnSelf)
    this.resolve = sinon.spy(returnSelf)
    this.done = sinon.spy(returnSelf)

    var returnPromise = function () { return this._promise }.bind(this)
    this._promise = {
      fail: sinon.spy(returnPromise),
      done: sinon.spy(returnPromise)
    }
    this.promise = sinon.spy(returnPromise)
  }

  var OriginalStatsGopherSid = StatsGopher.sid

  var spyAjaxFunction, postDeferred, postOptions;

  beforeEach(function () {
    StatsGopher.sid = function () {
      return 'sid';
    }
    postDeferred = new SpyDeferred();
    spyAjaxFunction = sinon.spy(function (options) {
      postOptions = options
      return postDeferred;
    });
  });

  describe('StatsGopher(options)', function() {
    it('throws if the options object does not have an ajax function', function () {
      expect(catchError(function () {
        new StatsGopher({
          Deferred: SpyDeferred,
          endpoint: 'whatever'
        })
      })).to.equal("Error: no 'ajax' function specified in options")
    });
    it('throws if the options object does not have an endpoint', function () {
      expect(catchError(function () {
        new StatsGopher({
          Deferred: SpyDeferred,
          ajax: spyAjaxFunction
        })
      })).to.equal("Error: no 'endpoint' option specified")
    });
    it('throws if the options object does not have a Deferred constructor', function () {
      expect(catchError(function () {
        new StatsGopher({
          ajax: spyAjaxFunction,
          endpoint: 'whatever'
        })
      })).to.equal("Error: no 'Deferred' constructor specified in options")
    });
    it('assigns the options to the statsGopher instance', function () {
      var options = {
        Deferred: SpyDeferred,
        ajax: spyAjaxFunction,
        endpoint: "meow"
      }
      var statsGopher = new StatsGopher(options)
      expect(statsGopher.options).to.eq(options)
    });
    it('assigns an empty buffer', function () {
      var options = {
        Deferred: SpyDeferred,
        ajax: spyAjaxFunction,
        endpoint: "meow"
      }
      var statsGopher = new StatsGopher(options)
      expect(statsGopher.buffer).to.have.length.of(0);
    });
    it('assigns an sid', function () {
      var options = {
        Deferred: SpyDeferred,
        ajax: spyAjaxFunction,
        endpoint: "meow"
      }
      var sid = "123456";
      StatsGopher.sid = sinon.spy(function () {
        return sid;
      });
      var statsGopher = new StatsGopher(options)
      expect(statsGopher.sid).to.equal(sid);
      expect(StatsGopher.sid.called).to.equal(true)
    });
  });
  describe('session recording', function() {
    var statsGopher, options;
    beforeEach(function () {
      options = {
        Deferred: SpyDeferred,
        ajax: spyAjaxFunction,
        endpoint: 'test-endpoint'
      }
    });
    afterEach(function () {
      document.cookie = 'testOne=;expires=Thu, 01 Jan 1970 00:00:00 GMT";'
      document.cookie = 'testTwo=;expires=Thu, 01 Jan 1970 00:00:00 GMT";'
      document.cookie = 'testThree=;expires=Thu, 01 Jan 1970 00:00:00 GMT";'
      document.cookie = 'sg-sid=;expires=Thu, 01 Jan 1970 00:00:00 GMT";'
    });
    it('the cookie options are passed to the method that constructs the cookie', function() {
      StatsGopher.sid = OriginalStatsGopherSid;
      options.cookie = { domain: 'localhost', path: '/' }
      sinon.spy(StatsGopher.docCookie, 'setItem');
      statsGopher = new StatsGopher(options)
      expect(StatsGopher.docCookie.setItem.calledWith(
        sinon.match.any,
        sinon.match.any,
        { domain: 'localhost', path: '/' }
      )).to.be.ok;
    });
    it('the cookie options are translated into a string that conforms to the document.cookie syntax', function() {
      // We can't reliably test whether the cookie options have been included in document.cookie, so check the
      // return value of the method.
      var statsGopherCookie = StatsGopher.docCookie.setItem('testTwo', 'testValue', { expires: 'Fri, 31 Dec 9999 23:59:59 GMT' } )
      expect(statsGopherCookie).to.equal('testTwo=testValue;expires=Fri, 31 Dec 9999 23:59:59 GMT')
    });
    it('the return value of the method that creates the cookie, is the same as the value of document.cookie', function() {
      var statsGopherCookie = StatsGopher.docCookie.setItem('testThree', 'testValue');
      expect(document.cookie).to.equal(statsGopherCookie);
    })
  });
  describe('instance methods', function() {
    var statsGopher, options;

    beforeEach(function () {
      options = {
        Deferred: SpyDeferred,
        ajax: spyAjaxFunction,
        endpoint: 'test-endpoint'
      }
      statsGopher = new StatsGopher(options)
    });

    describe('send(datum)', function() {
      it('stamps the datum with a sendTime of now', function() {
        var datum = {
          eventType: 'test-event'
        };
        var t0 = new Date().valueOf();
        statsGopher.send(datum);
        var t1 = new Date().valueOf();
        expect(datum.sendTime).to.be.at.least(t0)
        expect(datum.sendTime).to.be.at.most(t1)
      });
      it('stamps the datum with the sid', function() {
        var datum = {
          eventType: 'test-event'
        };
        statsGopher.sid = "SID-123"
        statsGopher.send(datum);
        expect(datum.sid).to.equal("SID-123");
      });
      it('starts the buffer', function () {
        statsGopher.startBuffer = sinon.spy(function () {
          statsGopher.deferred = new SpyDeferred()
        });
        statsGopher.send({
          eventType: 'test-event'
        });
        expect(statsGopher.startBuffer.called).to.equal(true)
      });
      it('puts the datum in the buffer', function () {
        var datum = {
          eventType: 'test-event'
        };

        statsGopher.send(datum);
        expect(statsGopher.buffer.indexOf(datum)).to.equal(0)
      });
      describe('the promise', function() {
        it('returns a promise with done/fail', function () {
          var datum = {
            eventType: 'test-event'
          };

          var dfd = statsGopher.send(datum);

          expect(typeof dfd.done).to.equal('function')
          expect(typeof dfd.fail).to.equal('function')
        });
      });
    });
    describe('startBuffer()', function() {
      describe('when there is no current buffer', function() {
        it('sets a timeout', function () {
          expect(statsGopher.timeout).to.equal(undefined)
          statsGopher.startBuffer()
          expect(statsGopher.timeout).not.to.equal(undefined)
        });
        it('sets a deferred', function () {
          expect(statsGopher.deferred).to.equal(undefined)
          statsGopher.startBuffer()
          expect(statsGopher.deferred).not.to.equal(undefined)
        });
      });
      describe('when there is a current timeout', function() {
        it('does not change it', function () {
          statsGopher.timeout = 34567
          statsGopher.startBuffer()
          expect(statsGopher.timeout).to.equal(34567)
        });
        it('does not change it', function () {
          statsGopher.buffer = 34567
          statsGopher.startBuffer()
          expect(statsGopher.buffer).to.equal(34567)
        });
      });
    });
    describe('flush()', function() {
      it('reinitializes the buffer', function () {
        statsGopher.send({eventType: 'test-event'});
        var originalBuffer = statsGopher.buffer
        expect(statsGopher.buffer.length).not.to.equal(0)
        statsGopher.flush()
        expect(statsGopher.buffer.length).to.equal(0)
        expect(statsGopher.buffer).not.to.equal(originalBuffer)
      });
      it('returns the current buffer', function () {
        var e = { eventType: 'test-event' }
        statsGopher.send(e);
        var originalBuffer = statsGopher.buffer
        var flushedBuffer = statsGopher.flush()
        expect(flushedBuffer).to.equal(originalBuffer)
        expect(flushedBuffer[0]).to.equal(e)
      });
    });
    describe('onTimeout()', function() {
      var buffer = [{eventType:"test"}];
      var deferred

      beforeEach(function () {
        statsGopher.flush = sinon.spy(function () {
          return buffer
        })
        deferred = new SpyDeferred()
        statsGopher.deferred = deferred
      })
      it('deletes the timeout', function () {
        statsGopher.startBuffer()
        expect(statsGopher.timeout).not.to.equal(undefined)
        statsGopher.onTimeout()
        expect(statsGopher.timeout).to.equal(undefined)
      });
      it('flushes the buffer', function () {
        statsGopher.onTimeout()
        expect(statsGopher.flush.called).to.equal(true)
      });
      it('calls ajax with the correct options', function () {
        statsGopher.onTimeout();
        expect(statsGopher.options.endpoint.length).not.to.equal(0)
        expect(postOptions.url).to.equal(statsGopher.options.endpoint)
        expect(postOptions.type).to.equal('POST')
        expect(postOptions.dataType).to.equal('text')
        expect(postOptions.data).to.equal(JSON.stringify(buffer))
        expect(postOptions.cache).to.equal(false)
      });
      describe('when the call succeeds', function() {

        it('resolves the deferred', function () {
          postDeferred.done = sinon.spy(function (cb) {
            cb()
            return postDeferred
          });
          statsGopher.onTimeout();
          expect(postDeferred.done.called).to.equal(true)
          expect(deferred.resolve.called).to.equal(true)
        });
        it('deletes the deferred', function () {
          statsGopher.onTimeout();
          expect(statsGopher.deferred).to.equal(undefined)
        });
      });
      describe('when the call fails', function() {
        it('fails the deferred', function () {
          postDeferred.fail = sinon.spy(function (cb) {
            cb()
            return postDeferred
          });
          statsGopher.onTimeout();
          expect(postDeferred.fail.called).to.equal(true)
          expect(deferred.reject.called).to.equal(true)
        });
        it('deletes the deferred', function () {
          statsGopher.onTimeout();
          expect(statsGopher.deferred).to.equal(undefined)
        });
      });
    });
  });
});
