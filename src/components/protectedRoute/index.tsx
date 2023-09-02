"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    let token = '';
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() =>{
        token = localStorage.getItem("token") as string
        if (!token) {
            setIsLoading(true);
            router.push('/signin');
        } else {
            setIsLoading(false);
        }
    },[router])
    

    if(isLoading){
        return <div>Loading...</div>
    }
    return <>{!isLoading && children}</>;
}

export default ProtectedRoute;
