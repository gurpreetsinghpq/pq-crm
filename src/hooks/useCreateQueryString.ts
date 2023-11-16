import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface UseCreateQueryStringProps {
    searchParams: URLSearchParams | null;
}

const useCreateQueryString = () => {
    const searchParams = useSearchParams()
    const createQueryString = useCallback(
        (params: Record<string, string | number | null>) => {
            const newSearchParams = new URLSearchParams(searchParams?.toString());

            for (const [key, value] of Object.entries(params)) {
                if (value === null) {
                    newSearchParams.delete(key);
                } else {
                    newSearchParams.set(key, String(value));
                }
            }

            return newSearchParams.toString();
        },
        [searchParams]
    );

    return createQueryString;
};

export default useCreateQueryString;
