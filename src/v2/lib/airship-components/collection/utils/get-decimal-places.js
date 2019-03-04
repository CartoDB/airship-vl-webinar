export default function getDecimalPlaces(decimalNumber) {
    function hasFraction(numberToCheck) {
        return Math.abs(Math.round(numberToCheck) - numberToCheck) > 1e-10;
    }
    let count = 0;
    while (hasFraction(decimalNumber * (10 ** count)) && isFinite(10 ** count)) {
        count++;
    }
    return count;
}
