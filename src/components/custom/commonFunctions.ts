export function handleOnChangeNumeric(
    event: React.ChangeEvent<HTMLInputElement>,
    field: any,
    isSeparator: boolean = true
  ) {
    const inputElement = event.target;
    const inputValue = inputElement.value;
  
    // Remove non-numeric characters except for . and ,
    const cleanedValue = inputValue.replace(/[^0-9.,]/g, '');
  
    // If the cleaned value is empty, set it as an empty string
    const formattedValue = cleanedValue === '' ? '' : formatNumber(cleanedValue, isSeparator);
  
    inputElement.value = formattedValue; // Update the input value
    field.onChange(formattedValue); // Update the field value
  }
  
  // Helper function to format a number with or without separators
  function formatNumber(value: string, isSeparator: boolean): string {
    const numericValue = +value.replace(/[,.]/g, ''); // Convert to a numeric value without commas and periods
    if (isNaN(numericValue)) {
      return ''; // Handle the case where the input is not a valid number
    }
    
    return isSeparator ? addSeparator(numericValue) : numericValue.toString();
  }
  
  // Helper function to add separators (e.g., commas) to a number
  function addSeparator(value: number): string {
    return value.toLocaleString();
  }
export const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const keyValue = event.key;
    const validCharacters = /^[0-9.,\b]+$/; // Allow numbers, comma, period, and backspace (\b)
    console.log(keyValue)
    if (!validCharacters.test(keyValue)) {
        event.preventDefault();
    }
};