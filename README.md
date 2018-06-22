# Chainfiy

This is a extremely simple class that extender that allows you to turn objects that aren't really chainable into chainable objects.

the Original intent was to build an XMLHttpRequest class that overrides all prototype methods but I then realized that it can be generalized to any class and thus this was born

## how to use
```javascript
var xhr = chainify(XMLHttpRequest)
var request = new xhr()
  .open("PUT", "/path/to/asset.ext")
  .addEventListener("load", function(ev){
    console.log("hey i've loaded", ev, this) // this is the current xhr request
  })
  .addEventListener("error", function(){
    console.log("halp error", ev, this) // this is the current xhr request
  })
  .send({
    foo: "bar"
  })
```

## Multiple Inheritance
Because chainify manually goes into prototypes of the children and creats replacement methods on it's own prototype and it's object you can use it to do multiple inheritance. However because this only happens once when you call the chainify method, you wont have additional methods from the chainified class get added after the fact. this may be an issue if you are altering your class prototypes at various instances so do be aware.
```javascript
class Organic{
    constructor(parentXX, parentXY){
        this.dna = []
        this.parents = [parentXX, parentXY]
        for(var i = 0; i < parentXX.dna.length || i < parentXY.dna.length; i++){
            this.dna[i] = (Math.random() > 0.5) ? parentXX.dna[i] : parentXY.dna[i]
        }
    }

    mate(otherOrganic){
        return new this.constructor(this, otherOrganic)
    }
}

var adam = {dna: [1,1,1,1,1,1,1,1]}
var eve = {dna: [0,0,0,0,0,0,0,0]}
var child = new Organic(eve, adam)

class Mechanical{
    constructor(ipAddress){
        this.ip = ipAddress
    }

    locate(){
        console.log(this.ip)
    }
}
var robo = new Mechanical("acdee")
robo.locate()


var compressedOrganic = chainify(Organic)
Object.setPrototypeOf(compressedOrganic.prototype, Mechanical.prototype)
class Cyborg extends Mechanical{
    constructor(parentXX, parentXY, ipAddress){
        super(ipAddress)
        compressedOrganic.call(this, parentXX, parentXY)
    }
}
Object.setPrototypeOf(Cyborg.prototype, compressedOrganic.prototype)
var roboCop = new Cyborg(eve, adam, "192.168.0.1")

```
