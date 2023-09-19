import { IValueLabel, ProfileGetResponse, TeamGetResponse, UsersGetResponse } from "@/app/interfaces/interface";
import { getToken } from "./leads";

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
export function camelCaseToTitleCase(input: string) {
  // Replace capital letters with a space followed by the same letter in uppercase
  return input.replace(/([A-Z])/g, ' $1')
    // Capitalize the first letter and remove leading spaces
    .replace(/^./, function (str) {
      return str.toUpperCase();
    })
    .trim();
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
const token_superuser = getToken()
export async function fetchUserDataList() {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/users/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    let data: UsersGetResponse[] = structuredClone(result.data)
    let dataToReturn = data.map((val)=>{
      const final:IValueLabel = {
        label: `${val.first_name} ${val.last_name}`,
        value: val.id.toString()
      }
      return final
    })
    return dataToReturn
  }
  catch (err) {
    console.log("error", err)
    return err
  }
}
export async function fetchTeamDataList() {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/team/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    let data: TeamGetResponse[] = structuredClone(result.data)
    let dataToReturn = data.map((val)=>{
      const final:IValueLabel = {
        label: `${val.name}`,
        value: val.id.toString()
      }
      return final
    })
    return dataToReturn
  }
  catch (err) {
    console.log("error", err)
    return err
  }
}
export async function fetchProfileDataList() {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/rbac/profile/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    let data: ProfileGetResponse[] = structuredClone(result.data)
    let dataToReturn = data.map((val)=>{
      const final:IValueLabel = {
        label: `${val.name}`,
        value: val.id.toString()
      }
      return final
    })
    return dataToReturn
  }
  catch (err) {
    console.log("error", err)
    return err
  }
}
export function getLength(data:any){
  return data.length
}