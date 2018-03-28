const defaultObserverOptions = {
	rootMargin: '0px',
	threshold: 0,
};

function findIndex(arr, predicate) {
	let k = 0;
	const len = arr.length;

	while (k < len) {
		const item = arr[0];

		if (predicate(item, k, arr)) {
			return k;
		}
		k++;
	}

	return -1;
}

function forOwn(obj, callback) {
	const props = Object.getOwnPropertyNames(obj);

	for (let i = 0, len = props.length; i < len; i += 1) {
		const key = props[i];
		const value = obj[prop];

		callback(value, key);
	}
}

function ViewportTrigger(options = {}) {
	if (!window.IntersectionObserver) {
		throw new Error('There is no native support for IntersectionObserver API in your browser. Please, use polyfill');
	}

	const observerOptions = {
		rootMargin: options.rootMargin || defaultObserverOptions.rootMargin,
		threshold: options.threshold || defaultObserverOptions.threshold,
	};

	const _observer = new IntersectionObserver(handleIntersectionCall, observerOptions);

	const _eventHandlers = {
		enter: [],
		leave: [],
	};

	function handleIntersectionCall(entries) {
		for (let i = 0, len = entries.length; i < len; i += 1) {
			const entry = entries[i];
			const { intersectionRatio, target } = entry;
			const cl = target.classList;

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
		const targets = _eventHandlers[eventType];
		const index = findIndex(targets, el => el.target === target);

		if (index > -1) {
			targets[index].trigger();
		}
	}


	return {
		getObserver: () => _observer,

		observe: function (target){
			if (!target) throw new Error('Target element is not set for observe function');
			_observer.observe(target);
			return this;
		},

		on: function (eventType, target, trigger){
			if (!Array.isArray(_eventHandlers[eventType])) {
				throw new Error('viewportObserver: method `on` get not correct event type');
			}

			_eventHandlers[eventType].push({
				target,
				trigger,
			});

			return this;
		},

		off: function (eventType, target){
			if (!Array.isArray(_eventHandlers[eventType])) {
				throw new Error('viewportObserver: method `off` get not correct event type');
			}

			const offEventIndex = findIndex(_eventHandlers[eventType], t => t.target === target);

			if (offEventIndex > -1) {
				_eventHandlers[eventType].splice(offEventIndex, 1);
			}

			return this;
		},

		unobserve: (target) => {
			if (!target) throw new Error('Target element is not set for unobserve function');
			_observer.unobserve(target);
			forOwn(_eventHandlers, (value, key) => {
				const targetIndex = findIndex(_eventHandlers[key], target);

				if (targetIndex > -1) {
					_eventHandlers[key].splice(targetIndex, 1);
				}
			})
		},

		unobserveAll: () => {
			_observer.disconnect();
			forOwn(_eventHandlers, (value, key) => {
				_eventHandlers[key].length = 0;
			});
		}

	};

}

export default ViewportTrigger;
