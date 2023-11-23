import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

const useDidMountEffect = (func:any, deps:any) => {
    const didMount = useRef(false);

    const router = useRouter()
    useEffect(() => {
        if (didMount.current) func();
        else {
            
            didMount.current = true
        };
    }, deps);
}

export default useDidMountEffect;