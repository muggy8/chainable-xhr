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
Because chainify manually goes into prototypes of the children and creats replacement methods on it's own prototype and it's object you can use it to do multiple inheritance. However because this only happens once when you call the chainify method, you wont have additional methods from the source of the chainified class get new properties added to it's prototype after the fact. This may be an issue if you are altering your class prototypes at various instances so do be aware.

Do also be aware that if you are in need of multiple inheritance, you are probably better off using object composition but if your code base is huge and re-working your code base is not an option then you may find the utility of multiple inheritance offered below userful 

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

class Human extends Organic{
    constructor(parentXX, parentXY, name){
        super(parentXX, parentXY)
        this.name = name
    }

    speak(){
        console.log("hi my name is", this.name)
    }
}

var child = new Human(eve, adam, "John Smith")

class Mechanical{
    constructor(ipAddress){
        this.ip = ipAddress
    }

    locate(){
        console.log(this.ip)
    }
}

var robo = new Mechanical("192.168.0.1")
robo.locate()


var compressedHuman = chainify(Human)
Object.setPrototypeOf(compressedHuman.prototype, Mechanical.prototype)
class Cyborg extends Mechanical{
    constructor(parentXX, parentXY, ipAddress){
        super(ipAddress)
        compressedHuman.call(this, parentXX, parentXY, "Cyborg")
    }
}
Object.setPrototypeOf(Cyborg.prototype, compressedHuman.prototype)
var roboCop = new Cyborg(eve, adam, "192.168.0.1")
```
