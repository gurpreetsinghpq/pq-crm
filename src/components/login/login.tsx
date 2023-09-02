"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const FormSchema2 = z.object({
    email: z.string({
        // required_error: "Please enter a name.",
    }).email(),
    password: z.string({
        // required_error: "Please select designation.",
    }),
})

const commonClasses = "text-md font-normal text-gray-900 focus:shadow-custom1 focus:border-[1px] focus:border-purple-300"

export default function Signin() {
    const router = useRouter();
    const [isSmallScreen, setIsSmallScreen] = useState(
        typeof window !== 'undefined' ? window.innerWidth < 1300 : false
    )
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const form2 = useForm<z.infer<typeof FormSchema2>>({
        resolver: zodResolver(FormSchema2),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    async function login() {
        setIsLoading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/login/`, { method: "POST", body: JSON.stringify(form2.getValues()), headers: { "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            setIsLoading(false)
            const { data: { token } } = result
            localStorage.setItem("token", token)
            router.replace('/dashboard')
        }
        catch (err) {
            setIsLoading(false)
            console.log("error", err)
        }
    }

    useEffect(() => {
        const handleResize = (): void => {
            setIsSmallScreen(window.innerWidth < 1300)
        }

        window.addEventListener('resize', handleResize)

        // Clean up event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return <div className="signin-container flex min-h-screen relative">
        <div className="left flex flex-col w-7/12 bg-purple-600 justify-center xl:py-[6rem] 2xl:py-[10rem]">
            <div className="flex flex-row mb-8 absolute top-[44px] left-[44px]">
                <Image src={"/purple-quarter-logo.png"} alt="purple search logo" width={167} height={44} />
            </div>
            <div className="flex flex-col h-full justify-between gap-[50px]">
                <div className="flex flex-row justify-center">
                    <div className="max-w-[596px]">
                        <Image src={"/carousel-1.png"} alt="carousel first" width={0} height={0} sizes="100vw"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-center align-middle">
                    <h2 className="text-white-900 text-2xl text-center mb-1 font-semibold">Automate your workflow in 3..2..1</h2>
                    <h3 className="text-purple-200 text-center text-base py-1">This is the description text here. This could be a <br /> two liner as well, and little longer if needed.</h3>
                </div>
            </div>
        </div>
        <Form {...form2}>

            <form className="right px-12 py-6 w-5/12 justify-center flex flex-col " >
                <Image alt="pq search" src={"/pq-search.png"} width={40} height={40} className="mb-5" />
                <h1 className="text-2xl my-2 text-gray-900 font-bold">Sign in</h1>
                <h2 className="text-gray-600 mb-6 text-sm">Welcome back! Please enter your details.</h2>
                <span className="text-gray-700 text-sm mb-1">Email</span>
                <FormField
                    control={form2.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="email" className={`mb-5 ${commonClasses}`} placeholder="Enter email" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <span className="text-gray-700 text-sm mb-1">Password</span>

                <FormField
                    control={form2.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="password" placeholder="Enter password" className={`${commonClasses}`} {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Link href={"/forgotpassword"} className="text-purple-700 font-bold my-6 text-sm">Forgot password</Link>
                <Button variant={"default"} onClick={login} type="button">Sign in</Button>
                <div className="text-gray-400 font-medium flex my-4 flex-row justify-center">OR</div>
                <Button variant={"google"} >
                    <Image src="/google.png" className="mr-3" height={24} width={24} alt="google search icon" /> Sign in with Google
                </Button>
            </form>
        </Form>
    </div>
}

