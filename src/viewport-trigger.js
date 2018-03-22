const defaultObserverConfig = {
	root: '0px',
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

class ViewportTrigger {
	constuctor(options) {

		if (!window.IntersectionObserver) {
			throw new Error('There is native support for IntersectionObserver API. Please, use polyfill');
		}

		this._observer = new IntersectionObserver(this.handleIntersectionCall, options);

		this._eventHandlers = {
			enter: [],
			leave: [],
		};
	}

	handleIntersectionCall(entries) {
		for (let i = 0, len = entries.length; i < len; i += 1) {
			const entry = entries[i];
			const { intersectionRatio, target } = entry;
			const cl = target.classList;

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

	handleEvent(eventType, target) {
		const targets = this._eventHandlers[type];
		const index = findIndex(targets, el => el.target === target);

		if (index > -1) {
			targets[index].trigger();
		}
	}

	observe = (target) => {
		if (!target) throw new Error('Target element is not set for observe function');
		this._observer.observe(target);
		return this;
	};

	unobserve = (target) => {
		if (!target) throw new Error('Target element is not set for unobserve function');
		this._observer.unobserve(target);
		forOwn(this._eventHandlers, (value, key) => {
			const targetIndex = findIndex(this._eventHandlers[key], target);

			if (targetIndex > -1) {
				this._eventHandlers[key].splice(targetIndex, 1);
			}
		})

		return this;
	};

	unobserveAll = () => {
		this._observer.disconnect();
		forOwn(this._eventHandlers, (value, key) => {
			this._eventHandlers[key].length = 0;
		});
	}

	on = (eventType, target, trigger) => {
		if (!Array.isArray(this._eventHandlers[eventType])) {
			throw new Error('viewportObserver: method `on` get not correct event type');
		}

		this._eventHandlers[type].push({
			target,
			trigger,
		});

		return this;
	};

	off = (eventType, target) => {
		if (!Array.isArray(this._eventHandlers[eventType])) {
			throw new Error('viewportObserver: method `off` get not correct event type');
		}

		const offEventIndex = findIndex(this._eventHandlers[eventType], t => t.target === target);

		if (offEventIndex > -1) {
			this._eventHandlers[eventType].splice(offEventIndex, 1);
		}

		return this;
	};

}

export default ViewportTrigger;
