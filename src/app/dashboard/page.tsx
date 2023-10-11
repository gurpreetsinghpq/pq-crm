"use client"
import DashboardComponent from "@/components/dashboard"
import { useEffect } from "react"


export default function Dashboard() {
    useEffect(() => {
        const script = document.createElement('script');
      
        script.src = "./html2pdf.min.js";
        script.async = true;
      
        document.body.appendChild(script);
      
        return () => {
          document.body.removeChild(script);
        }
      }, []);
    return (
        <DashboardComponent></DashboardComponent>
    )
}
