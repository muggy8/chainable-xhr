# Chainfiy

This is a extremely simple class that extender that allows you to turn objects that aren't really chainable into chainable objects.

the Original intent was to build an XMLHttpRequest class that overrides all prototype methods but I then realized that it can be generalized to any class and thus this was born

## how to use
```javascript
var xhr = chainify(XMLHttpRequest)
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
