import { FilterQuery } from "@/app/interfaces/interface";
import { usePathname, useRouter } from "next/navigation";
import useCreateQueryString from "./useCreateQueryString";

export function useCreateFilterQueryString(){

    const router = useRouter();
    const createQueryString = useCreateQueryString()
    const pathname = usePathname()
    function createFilterQueryString(data: FilterQuery[]) {
    
        const queryParamData: Record<string, string | number | null> = {};
    
        data.forEach((query) => {
            queryParamData[query.filterFieldName] = query.value;
        });
    
        router.push(
            `${pathname}?${createQueryString({
                page: 1,
                ...queryParamData
            })}`
        )
    }
    return createFilterQueryString
}