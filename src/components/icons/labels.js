export const ROCKSTAR_CLASS = "text-pink-600 bg-pink-50 border-pink-500"
export const HUSTLER_CLASS = "text-success-700 bg-success-50 border-success-600"
export const GODFATHER_CLASS = "text-purple-700 bg-purple-50 border-purple-600"
// export const SEGEMENT_COMMON_CLASS = "text-xs mr-[10px] px-[6px] py-[2px] border border-[1px] rounded-[6px] font-medium"
export const SEGEMENT_COMMON_CLASS = "text-sm mr-[10px] pl-[8px] pr-[10px] py-[4px] border border-[1px] rounded-[6px] font-medium"

export function RockstarIcon() {
    return <span className={`${SEGEMENT_COMMON_CLASS} ${ROCKSTAR_CLASS}`}>Rockstar</span>
}

export function HustlerIcon() {
    return <span className={`${SEGEMENT_COMMON_CLASS} ${HUSTLER_CLASS}`}>Hustler</span>
}

export function GodfatherIcon() {
    return <span className={`${SEGEMENT_COMMON_CLASS} ${GODFATHER_CLASS}`}>Godfather</span>
}