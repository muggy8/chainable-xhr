# chainable-xhr

This is a extremely simple class that extends the built in XMLHttpRequest object but overrides all methods that exists on the prototype so you can chain them together

## how to use
```javascript
var request = new xhr()
  .addEventListener("load", function(ev){
    console.log("hey i've loaded", ev, this) // this is the current xhr request
  })
  .addEventListener("error", function(){
    console.log("halp error", ev, this) // this is the current xhr request
  })
  .open("PUT", "/path/to/asset.ext")
  .send({
    foo: "bar"
  })
```
