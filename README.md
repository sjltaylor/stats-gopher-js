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
