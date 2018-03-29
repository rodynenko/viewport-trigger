# viewport-trigger
Perfomant, light library in pure JS to trigger callback when elements enter or leave viewport, using IntersectionObserver API

## Motivation
There are a lot of libraries which give you opportunity to trigger some actions when element enters and/or leaves viewport, but they use scroll's listeners and `getBoundingClientRect` calculations, which is not so efficient, because it force browser to synchronously calculate the style and layout ([link](https://gist.github.com/paulirish/5d52fb081b3570c81e3a#what-forces-layout--reflow)). [IntersectionObserver API](https://github.com/w3c/IntersectionObserver/blob/master/explainer.md) lets you know when observed element enters or leaves the browser’s viewport in more efficient way. It was introduced in Chrome 51, and now it's native for Firefox and Opera too.

## Install
```sh
# npm
npm i -S viewport-trigger 

# yarn
yarn add viewport-trigger
```

With module bundlers just use 
```javascript
// ES6
import ViewportTrigger from 'viewport-trigger';

// CommonJS
const ViewportTrigger = require('viewport-trigger');
```
Or include minified script before your scripts in `body` tag
```html
<script type="text/javascript" src="/path/to/viewport-trigger.min.js"></script>
```

## Usage
First of all, you need an observer with default options
```javascript
// create observer
const vt = new ViewportTrigger();
```
or with custom options (you can read about `rootMargin` on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin))
```javascript
// create observer with custom options
const vt = new ViewportTrigger({
  rootMargin: '100px 0 100px 0'
});
```
Then add target to observe and events to trigger. ViewportTrigger handles two events: `enter` (target enters viewport) and `leave` (target leaves viewport)
```javascript
// add DOM element as target
const target = document.getElementById('target');
vt.observe(target);

// add events handlers
vt
  .on('enter', target, () => {
    console.log('target entered viewport');
   })
  .on('leave', target, () => {
    console.log('target left viewport');
  });
```

## Browser support
IntersectionObserver API is available in the [latest browsers](https://caniuse.com/#feat=intersectionobserver). Use [polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) to support others.
