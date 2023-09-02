"use client"
import DashboardComponent from "@/components/dashboard"
import ProtectedRoute from "@/components/protectedRoute"

export default function Dashboard(){
    return (
        <ProtectedRoute>
           <DashboardComponent></DashboardComponent>
        </ProtectedRoute>
    )
}
