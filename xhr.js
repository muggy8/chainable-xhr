
var chainableify = function(classToWrap){
	var sourceInstanceKey = ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(-4)
	function wrapper (){
		Object.defineProperty(this, sourceInstanceKey, {
			value: new classToWrap()
		})
	}
	for(
		var sourceProto = classToWrap.prototype;
		sourceProto;
		sourceProto = Object.getPrototypeOf(sourceProto)
		// this is the same as a while loop but it's got less characters in it and we're trying to save space so ya
		// this loop basically iterates over the target prototype and all sub prototypes of that prototype till the end
	){
		var keys = Object.getOwnPropertyNames(sourceProto)
		for(var i = 0; i < keys.length; i++){
			var key = keys[i]
			if (Object.getOwnPropertyNames(wrapper.prototype).indexOf(key) > -1){
				// we check it this way cuz eventually the "hasownproperty method is gonnag get replaced by a getter so it becomes unreliable"
				continue
			}
			// console.log(key)
			Object.defineProperty(wrapper.prototype, key, {
				// enumerable: sourceProto.propertyIsEnumerable(key),
				// configurable: true,
				get: (function(staticKey){
					// we do this so we can keep a reference to the original function once the key property has changed because of the next itteration of this loop
					return function(){
						var value = this[sourceInstanceKey][staticKey]
						if (typeof value === "function"){
							return function(){
								var args = Array.prototype.slice.call(arguments)
								for(var i = 0; i < args.length; i++){
									if (typeof args[i] === "function"){
										args[i] = args[i].bind(this)
									}
								}
								var result = this[sourceInstanceKey][staticKey].apply(this[sourceInstanceKey], args)
								return (typeof result === "undefined") ? this :result
							}
						}
						return value
					}
				})(key),
				set: (function(staticKey){
					return function(val){
						this[sourceInstanceKey][staticKey] = val
					}
				})(key)
			})
		}
	}

	return wrapper
}
