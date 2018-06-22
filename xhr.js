function xhr (){
	this._XMLHttpRequest = new XMLHttpRequest()
}
for(
	var sourceProto = XMLHttpRequest.prototype;
	sourceProto;
	sourceProto = Object.getPrototypeOf(sourceProto)
	// this is the same as a while loop but it's got less characters in it and we're trying to save space so ya
	// this loop basically iterates over the target prototype and all sub prototypes of that prototype till the end
){
	for(var key in sourceProto){
		if (xhr.prototype.hasOwnProperty(key)){
			continue
		}
		// console.log(sourceProto.hasOwnProperty(key), key, Object.getOwnPropertyNames(sourceProto))
		Object.defineProperty(xhr.prototype, key, {
			enumerable: sourceProto.propertyIsEnumerable(key),
			// configurable: true,
			get: (function(staticKey){
				// we do this so we can keep a reference to the original function once the key property has changed because of the next itteration of this loop
				return function(){
					var value = this[staticKey]
					if (typeof staticKey === "function"){
						return function(){
							var args = Array.prototype.slice.call(arguments)
							for(var i = 0; i < args.length; i++){
								if (typeof args[i] === "function"){
									args[i] = args[i].bind(this)
								}
							}
							var result = this._XMLHttpRequest[staticKey].apply(this, args)
							return (typeof result === "undefined") ? this :result
						}
					}
					return value;

				}
			})(sourceProto, key),
			set: (function( staticKey){
				return function(val){
					this._XMLHttpRequest[staticKey] = val;
				}
			})(sourceProto, key)
		})
	}
}
