(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.ViewportTrigger = factory());
}(this, (function () { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

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

  var ViewportTrigger = function () {
  	function ViewportTrigger() {
  		var _this = this;

  		classCallCheck(this, ViewportTrigger);

  		this.observe = function (target) {
  			if (!target) throw new Error('Target element is not set for observe function');
  			_this._observer.observe(target);
  			return _this;
  		};

  		this.unobserve = function (target) {
  			if (!target) throw new Error('Target element is not set for unobserve function');
  			_this._observer.unobserve(target);
  			forOwn(_this._eventHandlers, function (value, key) {
  				var targetIndex = findIndex(_this._eventHandlers[key], target);

  				if (targetIndex > -1) {
  					_this._eventHandlers[key].splice(targetIndex, 1);
  				}
  			});

  			return _this;
  		};

  		this.unobserveAll = function () {
  			_this._observer.disconnect();
  			forOwn(_this._eventHandlers, function (value, key) {
  				_this._eventHandlers[key].length = 0;
  			});
  		};

  		this.on = function (eventType, target, trigger) {
  			if (!Array.isArray(_this._eventHandlers[eventType])) {
  				throw new Error('viewportObserver: method `on` get not correct event type');
  			}

  			_this._eventHandlers[type].push({
  				target: target,
  				trigger: trigger
  			});

  			return _this;
  		};

  		this.off = function (eventType, target) {
  			if (!Array.isArray(_this._eventHandlers[eventType])) {
  				throw new Error('viewportObserver: method `off` get not correct event type');
  			}

  			var offEventIndex = findIndex(_this._eventHandlers[eventType], function (t) {
  				return t.target === target;
  			});

  			if (offEventIndex > -1) {
  				_this._eventHandlers[eventType].splice(offEventIndex, 1);
  			}

  			return _this;
  		};
  	}

  	createClass(ViewportTrigger, [{
  		key: 'constuctor',
  		value: function constuctor(options) {

  			if (!window.IntersectionObserver) {
  				throw new Error('There is native support for IntersectionObserver API. Please, use polyfill');
  			}

  			this._observer = new IntersectionObserver(this.handleIntersectionCall, options);

  			this._eventHandlers = {
  				enter: [],
  				leave: []
  			};
  		}
  	}, {
  		key: 'handleIntersectionCall',
  		value: function handleIntersectionCall(entries) {
  			for (var i = 0, len = entries.length; i < len; i += 1) {
  				var entry = entries[i];
  				var intersectionRatio = entry.intersectionRatio,
  				    target = entry.target;

  				var cl = target.classList;

  				if (intersectionRatio > 0) {
  					if (cl.contains('in-viewport')) {
  						cl.remove('in-viewport');
  						this.handleEvent('leave', target);
  					} else {
  						cl.add('in-viewport');
  						this.handleEvent('enter', target);
  					}
  				} else if (cl.contains('in-viewport')) {
  					cl.remove('in-viewport');
  					this.handleEvent('leave', target);
  				}
  			}
  		}
  	}, {
  		key: 'handleEvent',
  		value: function handleEvent(eventType, target) {
  			var targets = this._eventHandlers[type];
  			var index = findIndex(targets, function (el) {
  				return el.target === target;
  			});

  			if (index > -1) {
  				targets[index].trigger();
  			}
  		}
  	}]);
  	return ViewportTrigger;
  }();

  return ViewportTrigger;

})));
