
export default function  isEmailValid(email) {
    // Define a regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Test the email against the regex and return the result
    return emailRegex.test(email);
}