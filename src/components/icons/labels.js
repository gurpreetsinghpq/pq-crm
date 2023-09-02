const ROCKSTAR_CLASS = "border-warning-600 bg-warning-50 text-warning-500"
const HUSTLER_CLASS = "text-success-700 bg-success-50 border-success-600"
const GODFATHER_CLASS = "text-purple-700 bg-purple-50 border-purple-200"
const COMMON_CLASS = "text-xs mr-[10px] px-[6px] py-[2px] border border-[1px] rounded-[6px] font-medium"

export function RockstarIcon() {
    return <span className={`${COMMON_CLASS} ${ROCKSTAR_CLASS}`}>Rockstar</span>
}

export function HustlerIcon() {
    return <span className={`${COMMON_CLASS} ${HUSTLER_CLASS}`}>Hustler</span>
}

export function GodfatherIcon() {
    return <span className={`${COMMON_CLASS} ${GODFATHER_CLASS}`}>Godfather</span>
}