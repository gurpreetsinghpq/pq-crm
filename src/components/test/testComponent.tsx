"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import React from 'react'

function TestComponent() {
    const { toast } = useToast()
    return (
        <Button
            variant="outline"
            onClick={() => {
                toast({
                    description: "Your message has been sent.",
                })
            }}
        >
            Show Toast
        </Button>
    )

}

export default TestComponent