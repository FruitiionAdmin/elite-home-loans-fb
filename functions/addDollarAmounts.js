export default function addDollarAmounts(amount1, amount2) {
    // Remove commas, dollar signs, and cents from the input strings
    const cleanAmount1 = amount1.replace(/[$,.]/g, "");
    const cleanAmount2 = amount2.replace(/[$,.]/g, "");
  
    // Parse the cleaned strings into numbers
    const number1 = parseFloat(cleanAmount1);
    const number2 = parseFloat(cleanAmount2);
  
    // Add the numbers together
    const sum = number1 + number2;
  
    // Format the sum back into a string with commas and dollar sign
    const formattedSum = "$" + sum.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  
    return formattedSum;
  }