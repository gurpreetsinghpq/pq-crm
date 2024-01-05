import { REGION, TIME_ZONES, TYPE } from "@/app/constants/constants";
import { ActivityAccToEntity, ActivityAccToEntityOrganisation, ActivityPatchBody, AddressFields, ClientGetResponse, DashboardSidebarLead, DashboardSidebarProspect, IValueLabel, InsightUserDropdown, NotificationGetResponse, Permission, PermissionResponse, ProfileGetResponse, TeamGetResponse, TimeRange, UserProfile, UsersDropdownGetResponse, UsersGetResponse } from "@/app/interfaces/interface";
import { getCookie } from "cookies-next";
import { toast } from "../ui/use-toast";
import { ChangeEvent } from "react";
import { getAllTime } from "../ui/date-range-picker";

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
  isPhoneMandatory: boolean,
  numberOfDigits: number = 13,
) {
  const inputElement = event.target;
  let inputValue = inputElement.value;

  // Remove non-numeric characters except for . and ,
  inputValue = inputValue.replace(/[^0-9.,]/g, '');

  // Limit the input to the specified number of digits
  if (numberOfDigits && inputValue.length > numberOfDigits) {
    inputValue = inputValue.slice(0, numberOfDigits);
  }

  // If the cleaned value is empty, set it as undefined
  const formattedValue = inputValue === '' ? undefined : formatNumber(inputValue, isSeparator);


  inputElement.value = formattedValue || ''; // Update the input value (use an empty string if undefined)
  field.onChange(formattedValue); // Update the field value

  if (isPhoneMandatory) {
    field.onChange(formattedValue || ""); // Set to an empty string if undefined
  } else {
    field.onChange(formattedValue || null); // Set to null if undefined
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
export function addSeparator(value: number): string {
  return value.toLocaleString();
}

export function addSeparatorAndRemoveDecimal(value: number): string {
  if (value === 0) {
    return "--"
  } else {
    return Math.round(value).toLocaleString();
  }
}
export const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  const keyValue = event.key;
  const validCharacters = /^[0-9.,\b]+$/; // Allow numbers, comma, period, and backspace (\b)

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
export async function fetchUserDataList(ownerList: boolean = false) {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/users/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    let data: UsersGetResponse[] = structuredClone(result.data)
    let activeUsers = data.filter((val) => val.is_active === true)

    let dataToReturn = activeUsers.map((val) => {
      const final: InsightUserDropdown = {
        label: `${val.first_name} ${val.last_name}`,
        value: val.id.toString(),
        function: val.function,
        profile: val.profile

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
export async function fetchUserDataListForDrodpdown(ownerList: boolean = false) {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/users/dropdown_list`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    let data: UsersDropdownGetResponse[] = structuredClone(result.data)
    // let activeUsers = data.filter((val) => val.is_active === true)

    let dataToReturn = data.map((val) => {
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



export async function fetchAccountFromId(entityId: number) {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/client/${entityId}/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    let data: ClientGetResponse = structuredClone(result.data)
    return data
  }
  catch (err) {
    console.log("error", err)
    return err
  }
}

export async function fetchActivityListAccToEntityOrganisation(entityId: number) {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/activity/activity_wo_notes/?organisation=${entityId}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    let data: ActivityAccToEntityOrganisation[] = structuredClone(result.data)
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
export function getName(data: any, customMessage?: string) {
  if (data) {
    return data.name
  }
  if (customMessage) {
    return customMessage
  } else {
    return "—"
  }
}

export function getActive(data: any) {
  if (data) {
    return data?.is_active
  }
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

export function compareTimeStrings(timeVlaue: string, currentTime: string, dueDate: Date | undefined, currentDate: Date): boolean {
  // Create Date objects for the current date and the two time strings
  if (dueDate) {
    if (dueDate.toDateString() === currentDate.toDateString()) {
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

export function replaceTimeZone(inputDate: string, replacementString: string) {
  // Use regular expressions to replace the timezone part
  const regex = /\+\d{4}\s\(.+?\)/;
  const updatedDate = inputDate.replace(regex, replacementString);
  return updatedDate;
}


export function getTimeOffsetFromUTC(utcValue: string) {
  const timeZone = TIME_ZONES.find(zone => zone.utc.includes(utcValue));
  if (timeZone) {
    const match = timeZone.text.match(/\(([^)]+)\)/);
    return match ? match[1].replace("UTC", "").replace(":", "").trim() : "Offset not found";

  }
  return "Time zone not found";
}
export function hasSpecialCharacter(inputString: string) {
  // Define a regular expression pattern to match special characters
  const regex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;

  // Use the .test() method to check if the string contains at least one special character
  return regex.test(inputString);
}

export async function fetchNotifications(): Promise<NotificationGetResponse[] | undefined> {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/notification/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    if (result.data) {
      return result.data
    }
    return undefined
  }
  catch (err: any) {
    return err
  }
}

export async function patchNotification(id: number, isViewed: boolean) {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/notification/${id}/`, { method: "PATCH", body: JSON.stringify({ is_viewed: isViewed }), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    if (result.data) {
      return result.data
    }
    return undefined
  }
  catch (err: any) {
    return err
  }
}
export async function clearNotification(id: number) {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/notification/${id}/`, { method: "DELETE", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    if (result.data) {
      return result.data
    }
    return undefined
  }
  catch (err: any) {
    return err
  }
}
export async function clearAllNotification() {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/notification/bulk_delete`, { method: "DELETE", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    if (result.data) {
      return result.data
    }
    return undefined
  }
  catch (err: any) {
    return err
  }
}


export function timeSince(date: string) {

  var seconds = Math.floor((+new Date() - +new Date(date)) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " year(s) ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " month(s) ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " day(s) ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hour(s) ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minute(s) ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

export function calculateMinuteDifference(
  currentHour: number,
  dueHour: number,
  currentMinute: number,
  dueMinute: number
): number {
  // Calculate the total minutes for each time
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  const dueTotalMinutes = dueHour * 60 + dueMinute;

  // Calculate the minute difference
  const minuteDifference = dueTotalMinutes - currentTotalMinutes;

  return minuteDifference;
}

export async function getIsContactDuplicate(emailId: string, mobile: string) {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/client/contact/is_duplicate/?email=${emailId}${mobile && mobile != "-" ? `&phone=${mobile}` : ""}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    if (result.data) {
      return result.data
    }
    return undefined
  }
  catch (err: any) {
    console.log("err", err)
    return err
  }
}
export async function getContactById(id: number) {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/client/contact/?id=${id}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    if (result.data && result.data.length > 0) {
      return result.data[0]
    }
    return undefined
  }
  catch (err: any) {
    console.log("err", err)
    return err
  }
}

export async function fetchCummulativeSummary(status: string, createdAtFrom: string | null, createdAtTo: string | null) {
  try {
    const createdAtFromQueryParam = createdAtFrom ? `&created_at_from=${encodeURIComponent(createdAtFrom)}` : '';
    const createdAtToQueryParam = createdAtTo ? `&created_at_to=${encodeURIComponent(createdAtTo)}` : '';
    const dataResp = await fetch(`${baseUrl}/v1/api/deal/cummulative_summary/?status=${status}${createdAtFromQueryParam}${createdAtToQueryParam}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    return result
  }
  catch (err: any) {
    console.log("err", err)
    return err
  }
}
export function toastContactAlreadyExists() {
  toast({
    title: "Contact already exists!",
    variant: "destructive"
  })
}
export function toastOtherError(e: string) {
  toast({
    title: e,
    variant: "destructive"
  })
}
export function formatNumberToTwoDigits(num: number): string {
  if (num < 10) {
    return `0${num}`;
  } else {
    return num.toString();
  }
}

export function formatBytes(bytes: any, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function convertLocalStringToNumber(localString: string): number | null {
  try {
    // Remove any commas from the input string
    const numberStr = localString.replace(/,/g, '');

    // Convert the string to a number
    const number = parseFloat(numberStr);

    if (!isNaN(number)) {
      return number;
    } else {
      return null;
    }
  } catch (error) {
    // Handle any errors, e.g., invalid input
    return null;
  }
}
export function extractFileNameFromUrl(url: string): string | null {
  const segments = url.split('/');
  if (segments.length > 0) {
    return segments[segments.length - 1];
  }
  return null;
}

export function arrayToCsvString(arr: (number | string | null | undefined)[]): string {
  return arr.map(item => item !== null ? item : '').join(',');
}
export function csvStringToArray(text: string): string[] {
  return text.split(",");
}
export function removeUndefinedFromArray(arr: (string | undefined)[]): string[] {
  // Use filter to create a new array without undefined values
  const filteredArray: string[] = arr.filter((item): item is string => item !== undefined);
  return filteredArray;
}


export function setDateHours(date: Date, isEnd: boolean) {
  const dateLocal = structuredClone(date)
  const from = new Date(dateLocal.setHours(0, 0, 0, 0)).toISOString()
  const to = new Date(dateLocal.setHours(23, 59, 59, 999)).toISOString()

  if (isEnd) {
    return to
  } else {
    return from
  }
}

export function extractName(inputString: string): string | null {
  // Define a regular expression to extract the name before "assigned Ownership for"
  const regex = /^(.+?) assigned Ownership for/;

  // Use the regular expression to match the input string
  const match = inputString.match(regex);

  // If a match is found, return the captured name (group 1)
  return match ? match[1].trim() : null;
}

export function getCurrencyAccToRegion(region: string) {
  const currency = REGION.find((reg) => reg.label === region)?.currency
  return currency
}


export function getCurrentFy(): TimeRange {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Check if the current date is on or after April 1st to consider the new financial year
  const isAfterApril = currentMonth >= 3; // April is month 3 (0-based index)
  
  // Adjust the start year based on whether the current date is after April
  const fyStartYear = isAfterApril ? currentYear : currentYear - 1;
  
  const fyStart = new Date(fyStartYear, 3, 1); // April is month 3 (0-based index)
  const fyEnd = new Date(fyStartYear + 1, 2, 31); // March is month 2 (0-based index)
  
  return { from: fyStart.toISOString(), to: fyEnd.toISOString() };
}


export function getLastFy(): TimeRange {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Check if the current date is on or after April 1st to consider the new financial year
  const isAfterApril = currentMonth >= 3; // April is month 3 (0-based index)
  
  // Adjust the start year based on whether the current date is after April
  const fyStartYear = isAfterApril ? currentYear - 1 : currentYear - 2;
  
  const fyStart = new Date(fyStartYear, 3, 1); // April is month 3 (0-based index)
  const fyEnd = new Date(fyStartYear + 1, 2, 31); // March is month 2 (0-based index)
  
  return { from: fyStart.toISOString(), to: fyEnd.toISOString() };
}


export function formatAddresses(data: AddressFields) {
  const {
    billing_address,
    billing_address_l2,
    billing_country,
    billing_city,
    billing_state,
    billing_zipcode,
    shipping_address,
    shipping_address_l2,
    shipping_country,
    shipping_city,
    shipping_state,
    shipping_zipcode,
  } = data;

  const formattedBillingAddress = [
    billing_address,
    billing_address_l2,
    billing_city,
    billing_state,
    billing_zipcode,
    billing_country,
  ]
    .filter((value) => value !== null && value !== undefined)
    .join(', ');

  const formattedShippingAddress = [
    shipping_address,
    shipping_address_l2,
    shipping_city,
    shipping_state,
    shipping_zipcode,
    shipping_country,
  ]
    .filter((value) => value !== null && value !== undefined)
    .join(', ');
  return {
    billing: formattedBillingAddress,
    shipping: formattedShippingAddress,
  };
}

export function areBillingAndShippingEqual(data: AddressFields): boolean {
  return (
    data.billing_address === data.shipping_address &&
    data.billing_address_l2 === data.shipping_address_l2 &&
    data.billing_city === data.shipping_city &&
    data.billing_country === data.shipping_country &&
    data.billing_state === data.shipping_state &&
    data.billing_zipcode === data.shipping_zipcode
  );
}

//  // Map RHF's dirtyFields over the `data` received by `handleSubmit` and return the changed subset of that data.
//  export function dirtyValues(dirtyFields: any | boolean, allValues: any): object {
//   // If *any* item in an array was modified, the entire array must be submitted, because there's no way to indicate
//   // "placeholders" for unchanged elements. `dirtyFields` is `true` for leaves.
//   if (dirtyFields === true || Array.isArray(dirtyFields))
//     return allValues;
//   // Here, we have an object
//   return Object.fromEntries(Object.keys(dirtyFields).map((key) => [key, dirtyValues(dirtyFields[key], allValues[key])]));
// }

export function dirtyValues<DirtyFields extends Record<string, unknown>, Values extends Record<keyof DirtyFields, unknown>>(
  dirtyFields: DirtyFields,
  values: Values
): Partial<typeof values> {
  const dirtyValue = Object.keys(dirtyFields).reduce((prev, key) => {
    // Unsure when RFH sets this to `false`, but omit the field if so.
    if (!dirtyFields[key]) return prev;

    return {
      ...prev,
      [key]:
        typeof dirtyFields[key] === 'object'
          ? dirtyValues(dirtyFields[key] as DirtyFields, values[key] as Values)
          : values[key],
    };
  }, {});

  return dirtyValue;
}

export async function markStatusOfActivity(entityId: number, status: string, cb: CallableFunction) {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/activity/${entityId}/update_status/`, { method: "PATCH", body: JSON.stringify({ status }), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    toast({
      title: `Activity Marked as ${status} Succesfully!`,
      variant: "dark"
    })
    cb()
  } catch (err) {
    console.log(err)
  }
}
export async function rescheduleActivity(entityId: number, data: ActivityPatchBody, cb: CallableFunction) {
  try {
    const dataResp = await fetch(`${baseUrl}/v1/api/activity/${entityId}/`, { method: "PATCH", body: JSON.stringify(data), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
    const result = await dataResp.json()
    const isReassign = data.assigned_to
    toast({
      title: `Activity ${isReassign ? "Reassigned" : "Rescheduled"} Successfully`,
      variant: "dark"
    })
    cb()
  } catch (err) {
    console.log(err)
  }
}
export const handleAlphaNumericKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  // Get the pressed key
  const pressedKey = event.key;

  // Check if any character has been pressed yet
  const inputValue = event.currentTarget.value;

  // Use a regular expression to allow only alphanumeric characters and space
  const isAlphanumericOrSpace = /^[a-zA-Z0-9 ]$/.test(pressedKey);

  // If the pressed key is not alphanumeric or space, prevent the input
  if (!isAlphanumericOrSpace) {
    event.preventDefault();
  } else if (pressedKey === ' ' && inputValue.trim() === '') {
    // Prevent space at the beginning of the input
    event.preventDefault();
  } else if (pressedKey === ' ' && inputValue.slice(-1) === ' ') {
    // Prevent consecutive spaces
    event.preventDefault();
  }
};




export const handleAlphaNumericPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
  // Get the pasted text
  const pastedText = event.clipboardData.getData('text');

  // Use a regular expression to remove special characters and trim extra spaces
  const sanitizedText = pastedText.replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();

  // Update the input value with the sanitized text
  document.execCommand('insertText', false, sanitizedText);

  // Prevent the default paste behavior
  event.preventDefault();
};




export function daysAgo(isoDateString: string): string {
  const currentDate = new Date();
  const providedDate = new Date(isoDateString);
  // Calculate the difference in milliseconds
  const timeDifference = currentDate.getTime() - providedDate.getTime();

  // Convert the difference to days
  const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

  if (daysDifference === 0) {
    return '0 day';
  } else {
    return `${daysDifference} ${daysDifference > 1 ? "days" : "day"}`;
  }
}

export function formatDays(days: number): string {

  if (days === 0) {
    return '—';
  } else {
    return `${days} ${days > 1 ? "days" : "day"}`;
  }
}


export function calculatePercentageChange(values: number[]): string {
  if (values.length <= 2) {
    throw new Error("Array must contain atleast two values.");
  }

  const currentValue = values[0];
  const previousValue = values[1];

  // const percentageChange = previousWeekValue !== 0
  //     ? ((currentWeekValue - previousWeekValue) / Math.abs(previousWeekValue)) * 100
  //     : (currentWeekValue !== 0 ? Infinity : 0); // Handles division by zero

  if (previousValue === 0 && currentValue === 0) {
    return `0% change`;
  }
  else if(previousValue === 0){
    return `Greater than 1000% increase`
  }
  // const percentageChange = (currentValue - previousValue) / ((currentValue + previousValue) / 2) * 100
  const percentageChange = ((currentValue - previousValue) / (previousValue )) * 100



  let sign = '' 
  if(percentageChange>=1){
    sign = "+"
  }else if(percentageChange<=-1){
    sign = "-"
  }else{
    sign = ""
  }

  if(percentageChange>1000){
    return 'Greater than 1000% increase or decrease'
  }

  return `${sign}${Math.abs(percentageChange).toFixed(0)}% change`;
}

export function replaceHyphenWithEmDash(data:string|number|undefined, isPercent?:boolean, customMessage=''):string|number|undefined {
  if(isPercent){
    return data === "-" ? "—" : `${data}%`
  }else{
    return data === "-" ? `—` : `${data} ${customMessage}`
  }
}



export function calculatePercentage(inputObj:any) {
  const totalSum = Object.values(inputObj).reduce((sum:number, value) => sum + Number(value), 0);

  
  if (totalSum === 0) {
    // If the total sum is 0, set each value to 0.0 with one decimal point
    const resultObj: any = {};
    for (const key in inputObj) {
        if (inputObj.hasOwnProperty(key)) {
            resultObj[key] = '0.0';
        }
    }
    return resultObj;
}

  const resultObj:any= {}

  for (const key in inputObj) {
      if (inputObj.hasOwnProperty(key)) {
          const percentage = ((Number(inputObj[key]) / totalSum) * 100).toFixed(1);
          resultObj[key] = percentage;
      }
  }

  return resultObj;
}
