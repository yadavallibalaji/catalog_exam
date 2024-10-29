class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Convert a string value in given base to decimal
function parseBaseValue(base, value) {
    return BigInt(parseInt(value, parseInt(base)));
}

// Extract and parse (x,y) points from the JSON data
function parsePoints(data) {
    const points = [];
    const { n, k } = data.keys;
    let count = 0;
    
    // Get all numeric keys and sort them
    const keys = Object.keys(data)
        .filter(key => key !== 'keys')
        .map(Number)
        .sort((a, b) => a - b);
    
    // Parse only k points as that's all we need
    for (const key of keys) {
        if (count >= k) break;
        
        const x = key;
        const pointData = data[key];
        const y = parseBaseValue(pointData.base, pointData.value);
        points.push(new Point(x, y));
        count++;
    }
    
    return points;
}

// Calculate the Lagrange basis polynomial at x
function basisPolynomial(points, j, x) {
    let numerator = 1;
    let denominator = 1;
    const xj = points[j].x;
    
    for (let m = 0; m < points.length; m++) {
        if (m !== j) {
            const xm = points[m].x;
            numerator *= (x - xm);
            denominator *= (xj - xm);
        }
    }
    
    return numerator / denominator;
}

// Implement Lagrange interpolation to find the constant term (f(0))
function lagrangeInterpolation(points) {
    let result = 0;
    
    for (let j = 0; j < points.length; j++) {
        result += Number(points[j].y) * basisPolynomial(points, j, 0);
    }
    
    // Round to nearest integer since we know the result should be an integer
    return BigInt(Math.round(result));
}

// Solve for the secret (constant term) given a test case
function solveSecret(testCase) {
    const points = parsePoints(testCase);
    return lagrangeInterpolation(points);
}

// Test cases
const testCase1 = {
    "keys": {"n": 4, "k": 3},
    "1": {"base": "10", "value": "4"},
    "2": {"base": "2", "value": "111"},
    "3": {"base": "10", "value": "12"},
    "6": {"base": "4", "value": "213"}
};

const testCase2 = {
    "keys": {"n": 10, "k": 7},
    "1": {"base": "6", "value": "13444211440455345511"},
    "2": {"base": "15", "value": "aed7015a346d63"},
    "3": {"base": "15", "value": "6aeeb69631c227c"},
    "4": {"base": "16", "value": "e1b5e05623d881f"},
    "5": {"base": "8", "value": "316034514573652620673"},
    "6": {"base": "3", "value": "2122212201122002221120200210011020220200"},
    "7": {"base": "3", "value": "20120221122211000100210021102001201112121"},
    "8": {"base": "6", "value": "20220554335330240002224253"},
    "9": {"base": "12", "value": "45153788322a1255483"},
    "10": {"base": "7", "value": "1101613130313526312514143"}
};

try {
    const secret1 = solveSecret(testCase1);
    const secret2 = solveSecret(testCase2);
    
    console.log("Secret for test case 1:", secret1.toString());
    console.log("Secret for test case 2:", secret2.toString());
} catch (error) {
    console.error("Error processing test cases:", error);
}