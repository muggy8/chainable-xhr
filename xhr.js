function xhr(){
	// we use the old version of array from to maintain as much backwards compatibility as we can
	XMLHttpRequest.apply(this, Array.prototype.slice.call(arguments))
}
xhr.prototype = Object.create(XMLHttpRequest.prototype)
for(
	var sourceProto = XMLHttpRequest.prototype;
	sourceProto;
	sourceProto = Object.getPrototypeOf(XMLHttpRequest.prototype)
	// this is the same as a while loop but it's got less characters in it and we're trying to save space so ya
	// this loop basically iterates over the target prototype and all sub prototypes of that prototype till the end
){
	for(var key in sourceProto){
		if (typeof sourceProto === "function"){
			Object.defineProperty(xhr.prototype, key, {
				enumerable: sourceProto.propertyIsEnumerable(key),
				value: (function(protoFn){ // we do this so we can keep a reference to the original function once the key property has changed because of the next itteration of this loop
					return function(){
						var args = Array.prototype.slice.call(arguments)
						for(var i = 0; i < args.length; i++){
							if (typeof args[i] === "function"){
								args[i] = args[i].bind(this)
							}
						}
						var results = protoFn.apply(this, args)
						return (typeof results === "undefined") ? this : results
					}
				})(sourceProto[key])
			})
		}
	}
}
