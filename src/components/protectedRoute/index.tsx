"use client"
import { User } from '@/app/interfaces/interface';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    let user: User;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userFromLocalstorage = localStorage.getItem("user")
        console.log("userFromLocalstorage", userFromLocalstorage)
        if (userFromLocalstorage) {
            user = JSON.parse(userFromLocalstorage)
            const token = user?.token
            if (!token) {
                noToken();
            } else {
                setIsLoading(false);
                router.replace("/dashboard")
            }
        } else {
            noToken();
        }
        console.log(user)

    }, [router])

    function noToken() {
        setIsLoading(true);
        router.replace('/signin');
    }


    if (isLoading) {
        return <div>Loading...</div>
    }
    return <>{!isLoading && children}</>;
}

export default ProtectedRoute;
