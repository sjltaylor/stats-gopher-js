stats-gopher-js
===============

Javascript client for Stats Gopher

[![Circle CI](https://circleci.com/gh/sjltaylor/stats-gopher-js.png?style=badge)](https://circleci.com/gh/sjltaylor/stats-gopher-js)

## Installing

`npm run dist` builds and minified the library to `./dist`

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
    ...
  })
```

* add arbitary data to the event
* the `eventType` field is set to `UserAction` by the stats gopher
* the `send` method stamps the event with a `sendTime`

### Helpers

```
  var helper = new StatsGopher.Helper(statsGopher);
  helper.listenToClicks();
  helper.listenToMousedown();
```

listens to all window clicks and reports click events.

#### Collecting Attributes

```
  var span = /* the span at the leaf of this fragment...
    <body>
      <div data-key="ancestor">
        <section>
          <div data-key="leaf-parent">
            <span data-key="leaf"
                  data-value="hello-world"
                  data-another-attribute="another-value"
                  data-page-title="some-other-title"
            >target-text</span>
          </div>
        </section>
      </div>
    </body>
  */
  var data = helper.elementData(el, 'click')
  statsGopher.send(data);

```

Where `data` looks like this:

```
  {
    eventType: "UserAction",
    key: "ancestor/leaf-parent/leaf",
    value: "hello-world",
    anotherAttribute: "another-value",
    interaction: "click",
    location: "<window.location.toString()>",
    pageTitle: "<the textContent of the first h1>",
    windowTitle: "<the document.title>",
    text: "target-text",
    href: "<the href value if the el is an anchor>"
  }

```
