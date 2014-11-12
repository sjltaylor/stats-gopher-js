stats-gopher-js
===============

Javascript client for Stats Gopher

[![Circle CI](https://circleci.com/gh/sjltaylor/stats-gopher-js.png?style=badge)](https://circleci.com/gh/sjltaylor/stats-gopher-js)

## Installing

`gulp dist` builds and minified the library to `./dist`

Serve `dist/stats_gopher[.min].js` from within your app


## Usage

### Initialization

```
var statsGopher = new StatsGopher({
  ajax: $.ajax,
  Deferred: $.Deferred,
  endpoint: "http://example.net"
  // interval: 123 (optional send interval in milliseconds)
})

```

where `jQuery` is expected to be a jQuery-like interface with a `.ajax` method

### Sending Data

```
  statsGopher.send({
    anything: "you like",
    ...
  })
```

* add arbitary data to the event
* the `send` method stamps the event with a `sendTime`
* sending is throttled; events are buffer for 100ms before being sent in bulk


## Presence Monitors

The stats gopher has a presence endpoint which can be notified of different
types of activity.

The following helpers should be constructed with a `statsGopher` that has a
presence `endpoint` and a `key`. The key is the globally unique identifer for
the topic of presence. For example, if you wanted a heartbeat of the browser for
a user on a single page, the key could be `<session-id>/site-name/page-name`.
For a unique cookie-based session identifier: `StatsGopher.sid()`

See the stats-gopher documentation: http://github.com/sjltaylor/stats-gopher

```
new StatsGopher.Heartbeat({
  statsGopher: statsGopher,
  key: 'session-id/my-site/a-page'
}).start()
```

Sends a `heartbeat` signal to the presence endpoint in the background

```
new StatsGopher.UserActivity({
  statsGopher: statsGopher,
  key: 'session-id/my-site/a-page'
}).listen()
```

Send `user-activity` signals when the following window events occur:

* resize
* click
* mousedown
* scroll
* mousemove
* keydown

Signalling is throttled; a `user-activity` event is not sent for every event

Presence monitors can be paused and resumed with `.pause()` and `.resume()`
