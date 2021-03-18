const {createBinder} = require("./util")

describe('Testing the utility file',()=>{
test("createBinder",done=>{

    class Test {
        constructor() {

            this.bind = createBinder(this);
        }

        getHello() {
            return this.bind("hello");
        }

        hello(){
            done()
        }
    }

    let t = new Test();

    let hello = t.getHello();
    hello()
})
})