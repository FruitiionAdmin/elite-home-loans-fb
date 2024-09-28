export default function calculatePercentage(amount1, amount2) {
    // Remove commas, dollar signs, and cents from the input strings
    const cleanAmount1 = amount1.replace(/[$,.]/g, "");
    const cleanAmount2 = amount2.replace(/[$,.]/g, "");
  
    // Parse the cleaned strings into numbers
    const number1 = parseFloat(cleanAmount1);
    const number2 = parseFloat(cleanAmount2);
  
    // Calculate the percentage
    const percentage = (number1 / number2) * 100;
  
    return percentage.toFixed(2) + "%";
  }