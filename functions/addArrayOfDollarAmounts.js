export default function addArrayOfDollarAmounts(dollarAmounts) {
    const totalCents = dollarAmounts.reduce((total, amount) => {
        const amountWithoutSymbols = amount.replace(/[\$,]/g, "");
        return total + parseFloat(amountWithoutSymbols);
      }, 0);
    
      const formattedAmount = totalCents.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    
      return formattedAmount;
  }