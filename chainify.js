
var chainify = function(classToWrap){
	var sourceInstanceKey = ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(-4)

	function defineReplacement(onto, key){
		Object.defineProperty(onto, key, {
			// enumerable: sourceProto.propertyIsEnumerable(key),
			// configurable: true,
			get: function(){
				var value = this[sourceInstanceKey][key]
				if (typeof value === "function"){
					return function(){
						var args = Array.prototype.slice.call(arguments)
						for(var i = 0; i < args.length; i++){
							if (typeof args[i] === "function"){
								args[i] = args[i].bind(this)
							}
						}
						var result = this[sourceInstanceKey][key].apply(this[sourceInstanceKey], args)
						return (typeof result === "undefined" || result === this[sourceInstanceKey]) ? this :result
					}
				}
				return value
			},
			set:function(val){
				this[sourceInstanceKey][key] = val
			}
		})
	}

	function wrapper (){
        var boundConstructor = Function.prototype.bind.apply(classToWrap, [null].concat(Array.prototype.slice.call(arguments)))
		Object.defineProperty(this, sourceInstanceKey, {
			value: new boundConstructor()
		})
		var keys = Object.getOwnPropertyNames(this[sourceInstanceKey])
		for(var i = 0; i < keys.length; i++){
			defineReplacement(this, keys[i])
		}
	}
	for(
		var sourceProto = classToWrap.prototype;
		sourceProto && sourceProto !== Object.prototype;
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
			defineReplacement(wrapper.prototype, key)
		}
	}

	return wrapper
}
