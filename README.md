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


## Presence Monitors

The stats gopher has a presence endpoint which can be notified of different
types of activity.

The following helpers should be constructed with a `statsGopher` that has a
presence `endpoint`.

See the stats-gopher documentation: http://github.com/sjltaylor/stats-gopher

```
new StatsGopher.Heartbeat(statsGopher).start()
```

Sends a `heartbeat` signal to the presence endpoint in the background

```
new StatsGopher.UserActivity(statsGopher).listen()
```

Send `user-activity` signals when the following window events occur:

* pageshow
* popstate
* resize
* click
* mousedown
* scroll
* mousemove
* keydown

Signalling is throttled; a `user-activity` event is not send for every event
