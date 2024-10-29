const fs = require('fs');


function customDecodeYValue(base, value) {
    return BigInt(value, base);
}


function customLagrangeInterpolation(xValues, yValues, x) {
    let result = 0n;
    for (let i = 0; i < xValues.length; i++) {
        let term = yValues[i];
        for (let j = 0; j < xValues.length; j++) {
            if (i !== j) {
                term *= (BigInt(x) - BigInt(xValues[j])) / (BigInt(xValues[i]) - BigInt(xValues[j]));
            }
        }
        result += term;
    }
    return result;
}


function customCalculateConstantTerm(xValues, yValues) {
    const m = xValues.length - 1;
    const x = 0n;
    const c = customLagrangeInterpolation(xValues, yValues, x);
    return c.toString();
}


function customParseJsonInput(jsonString) {
    const jsonObject = JSON.parse(jsonString);
    const keys = jsonObject.keys;
    const n = keys.n;
    const k = keys.k;

    const xValues = [];
    const yValues = [];

    for (let i = 1; i <= n; i++) {
        const point = jsonObject[i.toString()];
        xValues.push(i);
        yValues.push(customDecodeYValue(point.base, point.value));
    }

    return { n, k, xValues, yValues };
}


function main() {
   
    const jsonString = fs.readFileSync('input.json', 'utf8');

    
    const { n, k, xValues, yValues } = customParseJsonInput(jsonString);

   
    const c = customCalculateConstantTerm(xValues.slice(0, k), yValues.slice(0, k));

    console.log('Constant term (c):', c);
}


main();
