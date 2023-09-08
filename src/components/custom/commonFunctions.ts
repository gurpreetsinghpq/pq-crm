export function handleOnChangeNumeric(event: React.ChangeEvent<HTMLInputElement>, field: any, isSeparator: boolean = true) {
    const cleanedValue = event.target.value.replace(/[,\.]/g, '')
    console.log(cleanedValue)
    if (isSeparator) {
        return field.onChange((+cleanedValue).toLocaleString())
    } else {
        return field.onChange((+cleanedValue).toString())
    }
}
export const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const keyValue = event.key;
    const validCharacters = /^[0-9.,\b]+$/; // Allow numbers, comma, period, and backspace (\b)


    if (!validCharacters.test(keyValue)) {
        event.preventDefault();
    }
};