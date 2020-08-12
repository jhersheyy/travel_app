//Import the js file to test
import { initPage } from "../src/client/js/app"
//Define the input for the function.
// The describe() function takes two arguments - a string description,

describe("Testing the sever functionality", () => {
    //and a test suite as a callback function
    // The test() function has two arguments - a string description, 
    test("Testing the initPage() function", () => {
           // and an actual test as a callback function.  
           // Define the input for the function, if any, in the form of variables/array
           //var input = [];
           // Define the expected output, if any, in the form of variables/array
           //const result;
           // `expect(myFunction(arg1, arg2, ...)).toEqual(expectedValue);`, where `toEqual()` is a matcher
           expect(initPage).toBeDefined();
})});



//Check if the function produces the expected output


