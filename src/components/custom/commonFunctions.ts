import { TYPE } from "@/app/constants/constants";
import { ActivityAccToEntity, IValueLabel, Permission, PermissionResponse, ProfileGetResponse, TeamGetResponse, UserProfile, UsersGetResponse } from "@/app/interfaces/interface";
import { getCookie } from "cookies-next";

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

export function handleOnChangeNumericReturnNull(
  event: React.ChangeEvent<HTMLInputElement>,
  field: any,
  isSeparator: boolean = true,
  isPhoneMandatory: boolean
) {
  const inputElement = event.target;
  const inputValue = inputElement.value;

  // Remove non-numeric characters except for . and ,
  const cleanedValue = inputValue.replace(/[^0-9.,]/g, '');

  // If the cleaned value is empty, set it as undefined
  const formattedValue = cleanedValue === '' ? undefined : formatNumber(cleanedValue, isSeparator);
  console.log("input value", inputValue, "cleanedValue", cleanedValue, "formattedValue", formattedValue)

  inputElement.value = formattedValue || ''; // Update the input value (use an empty string if undefined)
  field.onChange(formattedValue); // Update the field value
  if (isPhoneMandatory) {
    // form2.setValue("phone", "", SET_VALUE_CONFIG)
    field.onChange(formattedValue || "")
  } else {
    // form2.setValue("phone", null, SET_VALUE_CONFIG)
    field.onChange(formattedValue || null)
  }
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

export const handleKeyPressReturnUndefined = (event: React.KeyboardEvent<HTMLInputElement>, field: any) => {
  const keyValue = event.key;
  const validCharacters = /^[0-9.,\b]+$/; // Allow numbers, comma, period, and backspace (\b)
  const inputValue = event.currentTarget.value;

  if (keyValue === 'Backspace' && inputValue === '') {
    field.onChange(undefined); // Set the field value to undefined when backspace is pressed and input is empty
  } else if (!validCharacters.test(keyValue)) {
    event.preventDefault(); // Prevent input of invalid characters
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
let token_superuser = "";
export async function fetchUserDataList() {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/users/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    let data: UsersGetResponse[] = structuredClone(result.data)
    let activeUsers = data.filter((val) => val.is_active === true)
    let dataToReturn = activeUsers.map((val) => {
      const final: IValueLabel = {
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
export async function fetchActivityListAccToEntity(entityId: number) {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/activity/activity_wo_notes/?lead=${entityId}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    let data: ActivityAccToEntity[] = structuredClone(result.data)
    let filteredData = data.filter((val) => val.status !== null)
    return filteredData
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
    let dataToReturn = data.map((val) => {
      const final: IValueLabel = {
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
    let dataToReturn = data.map((val) => {
      const final: IValueLabel = {
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

export async function fetchProfileDetailsById(id: string): Promise<PermissionResponse[]> {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/rbac/profile/${id}/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    if (result.data.permissions) {
      const data: PermissionResponse[] = structuredClone(result?.data?.permissions)
      console.log("userPermissions", data)

      return data
    }
    return []
  }
  catch (err: any) {
    return err
  }
}

export const setToken = (token: string) => {
  token_superuser = token
}
export async function fetchMyDetails(): Promise<UserProfile | undefined> {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/users/my_account/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    if (result.data) {
      return result.data
    }
  }
  catch (err: any) {
    return err
  }
}



export function getLength(data: any) {
  return data.length
}
export function getName(data: any) {
  if (data) {
    return data.name
  }
  return "—"
}

export function getFullName(data: any) {
  if (data) {
    return `${data.first_name} ${data.last_name}`
  }
  return "—"
}
export function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export const getToken = () => {
  return token_superuser
}

export let TIMEZONE = ''
export async function fetchTimeZone() {
  const myDetails = await fetchMyDetails();
  if (myDetails) {
    const timeZone = myDetails.time_zone;
    if (timeZone) {
      TIMEZONE = timeZone
      return timeZone
    }
  }
}

export async function getCurrentDateTime() {
  const myDetails = await fetchMyDetails();
  if (myDetails) {
    const timeZone = myDetails.time_zone;
    if (timeZone) {
      const userTimezone = timeZone; // Change this to the user's timezone.
      const now = new Date();
      const userDateTime = new Intl.DateTimeFormat("en-US", {
        timeZone: userTimezone,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false, // Use 24-hour format
      }).format(now);
      return userDateTime; // This returns both date and time in the user's timezone.
    }
  }
}

export function compareTimeStrings(timeVlaue: string, currentTime: string, todayDate: Date | undefined): boolean {
  // Create Date objects for the current date and the two time strings
  if (todayDate) {

    const currentDate: Date = new Date();
    if (todayDate.getDay() === currentDate.getDay() && todayDate.getMonth() === currentDate.getMonth() && todayDate.getFullYear() === currentDate.getFullYear()) {

      const timeParts1: string[] = timeVlaue.split(":");
      const timeParts2: string[] = currentTime.split(":");
      const time1: Date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        parseInt(timeParts1[0]),
        parseInt(timeParts1[1])
      );
      const time2: Date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        parseInt(timeParts2[0]),
        parseInt(timeParts2[1])
      );

      // Compare the Date objects to determine which time is in the past
      if (time1 < time2) {
        return true
      } else {
        return false
      }
    }
    return false
  }
  return false
}

export function changeBooleanToYesOrNo(value: boolean | undefined | null) {

  if (value === null || value === undefined) {
    return "—"
  } else {
    if (value) {
      return "Yes"
    } else {
      return "No"
    }

  }
}
export function checkIsPhoneMandatory(type: string): boolean {
  if (type === "decisionMaker" || type === "investor" || type === "accountsPayable" || type === "budgetHolder") {
    return true
  } else {
    return false
  }
}

export function backendkeyToTitle(keyName: string) {
  const keySplitted = keyName.split("_")
  let finalName: string = ""
  if (keySplitted.length > 0) {
    keySplitted.map((val, index) => {
      finalName += `${val[0].toUpperCase()}${val.slice(1)}${keySplitted.length - 1 === index ? "" : " "}`
    })
    return finalName
  } else {
    return keyName
  }

}

export function getMandatoryFromType() {
  return TYPE.filter((val) => val.mandatory).map(val => val.value)
}
export function doesTypeIncludesMandatory(value: string) {
  return TYPE.filter((val) => val.mandatory).map(val => val.value).includes(value)
}
