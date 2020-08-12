import { getCountdown } from "../src/client/js/helpers"


describe('Testing countdown functionality' , () => {
    let testdate = "2020-09-28";
    test("Testing the getCountdown()", async () => {
        const result = getCountdown(testdate);
        expect(result).toBeGreaterThanOrEqual(47);
    });
});

// describe('Testing urlChecker() function for illegitimate urls' , () => {
//     var url = "asdlgkajiej093280982.clkj19a";
//     test('It should return true', async () => {//make it a null one
//         const response = checkURL(url);
//         expect(response).toBeDefined();
//         expect(response).toBeFalsy();
//     });
// });