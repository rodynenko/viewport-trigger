(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ViewportTrigger = factory());
}(this, (function () { 'use strict';

	var defaultObserverOptions = {
		rootMargin: '0px',
		threshold: 0
	};

	function findIndex(arr, predicate) {
		var k = 0;
		var len = arr.length;

		while (k < len) {
			var item = arr[0];

			if (predicate(item, k, arr)) {
				return k;
			}
			k++;
		}

		return -1;
	}

	function forOwn(obj, callback) {
		var props = Object.getOwnPropertyNames(obj);

		for (var i = 0, len = props.length; i < len; i += 1) {
			var key = props[i];
			var value = obj[prop];

			callback(value, key);
		}
	}

	function ViewportTrigger() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		if (!window.IntersectionObserver) {
			throw new Error('There is no native support for IntersectionObserver API in your browser. Please, use polyfill');
		}

		var observerOptions = {
			rootMargin: options.rootMargin || defaultObserverOptions.rootMargin,
			threshold: options.threshold || defaultObserverOptions.threshold
		};

		var _observer = new IntersectionObserver(handleIntersectionCall, observerOptions);

		var _eventHandlers = {
			enter: [],
			leave: []
		};

		function handleIntersectionCall(entries) {
			for (var i = 0, len = entries.length; i < len; i += 1) {
				var entry = entries[i];
				var intersectionRatio = entry.intersectionRatio,
				    target = entry.target;

				var cl = target.classList;

				if (intersectionRatio > 0) {
					if (cl.contains('in-viewport')) {
						cl.remove('in-viewport');
						handleEvent('leave', target);
					} else {
						cl.add('in-viewport');
						handleEvent('enter', target);
					}
				} else if (cl.contains('in-viewport')) {
					cl.remove('in-viewport');
					handleEvent('leave', target);
				}
			}
		}

		function handleEvent(eventType, target) {
			var targets = _eventHandlers[eventType];
			var index = findIndex(targets, function (el) {
				return el.target === target;
			});

			if (index > -1) {
				targets[index].trigger();
			}
		}

		return {
			getObserver: function getObserver() {
				return _observer;
			},

			observe: function observe(target) {
				if (!target) throw new Error('Target element is not set for observe function');
				_observer.observe(target);
				return this;
			},

			on: function on(eventType, target, trigger) {
				if (!Array.isArray(_eventHandlers[eventType])) {
					throw new Error('viewportObserver: method `on` get not correct event type');
				}

				_eventHandlers[eventType].push({
					target: target,
					trigger: trigger
				});

				return this;
			},

			off: function off(eventType, target) {
				if (!Array.isArray(_eventHandlers[eventType])) {
					throw new Error('viewportObserver: method `off` get not correct event type');
				}

				var offEventIndex = findIndex(_eventHandlers[eventType], function (t) {
					return t.target === target;
				});

				if (offEventIndex > -1) {
					_eventHandlers[eventType].splice(offEventIndex, 1);
				}

				return this;
			},

			unobserve: function unobserve(target) {
				if (!target) throw new Error('Target element is not set for unobserve function');
				_observer.unobserve(target);
				forOwn(_eventHandlers, function (value, key) {
					var targetIndex = findIndex(_eventHandlers[key], target);

					if (targetIndex > -1) {
						_eventHandlers[key].splice(targetIndex, 1);
					}
				});
			},

			unobserveAll: function unobserveAll() {
				_observer.disconnect();
				forOwn(_eventHandlers, function (value, key) {
					_eventHandlers[key].length = 0;
				});
			}

		};
	}

	return ViewportTrigger;

})));
