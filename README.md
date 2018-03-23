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

## Browser support
IntersectionObserver API is available in the [latest browsers](https://caniuse.com/#feat=intersectionobserver). Use [polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) to support others.
