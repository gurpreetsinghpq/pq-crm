"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "../ui/use-toast"
import { parseJwt, setToken } from "../custom/commonFunctions";
import { GoogleUserInfo } from "@/app/interfaces/interface";
import { setCookie} from "cookies-next"


const FormSchema = z.object({
    email: z.string({
        required_error: "Please enter email.",
    }).email(),
    password: z.string({
        required_error: "Please enter password.",
    }),
})

const commonClasses = "text-md font-normal text-gray-900 focus:shadow-custom1 focus:border-[1px] focus:border-purple-300"

interface PostLogin {
    message: string,
    status: number,
    show: boolean
}

export default function Signin() {
    const router = useRouter();
    const [postLogin, setPostLogin] = useState<PostLogin>()
    const [isSmallScreen, setIsSmallScreen] = useState(
        typeof window !== 'undefined' ? window.innerWidth < 1300 : false
    )
    const [timerId, setTimerId] = useState<number | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [googleWidth, setGoogleWidth] = useState<string>("")

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
        mode: "all"
    })

    const buttonRef: any = useRef(null)

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    async function login() {
        setIsLoading(true)

        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/login/`, { method: "POST", body: JSON.stringify(form.getValues()), headers: { "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            setIsLoading(false)
            if (result.status == 1) {
                const { data } = result
                console.log(result)
                const {
                    token,
                    ...objWithoutToken
                } = data
                localStorage.setItem("user", JSON.stringify(objWithoutToken))
                setCookie("token", data.token)
                setToken(data.token)
                router.replace('/dashboard')
                setPostLogin({ message: "Succesfully logged in", status: 1, show: true })
                toast({
                    title: "Logged in!",
                    variant: "dark"
                })
            } else {
                const errormsg = "User Not Active | Unable to login with given credentials!"
                if (result?.error?.non_field_errors?.includes(errormsg)) {
                    toast({
                        title: errormsg,
                        variant: "destructive"
                    })
                    // setPostLogin({ message: errormsg, status: 0, show: true })
                } else {
                    // setPostLogin({ message: "Sorry some error have occured", status: 0, show: true })
                    toast({
                        title: "Sorry some error have occured",
                        variant: "destructive"
                    })
                }
            }
            setTimeout(() => {
                setPostLogin(undefined)
            }, 3000)

        }
        catch (err) {
            setIsLoading(false)
            console.log("error", err)

        }
    }

    function onSubmit() {
        login()
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

    useEffect(() => {
        const googleWidth = buttonRef.current?.offsetWidth
        console.dir(buttonRef.current)
        setGoogleWidth(`${googleWidth}px`)

    }, [])

    async function signinWithGoogle(jwt: GoogleUserInfo) {
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/users/gauth/`, { method: "POST", body: JSON.stringify(jwt), headers: { "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            setIsLoading(false)
            const { data } = result
            const {
                token,
                ...objWithoutToken
            } = data
            console.log(result)
            if (result.status == 1) {
                localStorage.setItem("user", JSON.stringify(objWithoutToken))
                setCookie("token", data.token)
                setToken(data.token)
                router.replace('/dashboard')
                setPostLogin({ message: "Succesfully logged in", status: 1, show: true })
                toast({
                    title: "Logged in!",
                    variant: "dark"
                })
            } else {
                const errormsg = "User Not Active | Unable to login with given credentials!"
                if (result?.error?.non_field_errors?.includes(errormsg)) {
                    toast({
                        title: errormsg,
                        variant: "destructive"
                    })
                } else {
                    toast({
                        title: "Sorry some error have occured",
                        variant: "destructive"
                    })
                }
            }
            setTimeout(() => {
                setPostLogin(undefined)
            }, 3000)

        }
        catch (err) {
            setIsLoading(false)
            console.log("error", err)

        }

    }

    return <div className="signin-container flex min-h-screen relative">
        <div className="left flex flex-col w-7/12 bg-purple-600 justify-center py-[6rem] 2xl:py-[10rem]">
            <div className="flex flex-row mb-8 absolute top-[44px] left-[44px]">
                <Image src={"/images/purple-quarter-logo.png"} alt="purple search logo" width={167} height={44} />
            </div>
            <div className="flex flex-col h-full justify-between gap-[50px]">
                <div className="flex flex-row justify-center">
                    <div className="max-w-[596px]">
                        <Image src={"/images/carousel-1.png"} alt="carousel first" width={0} height={0} sizes="100vw"
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
        <div className="right px-12 py-6 w-5/12 justify-center flex flex-col ">

            <Form {...form} >
                <form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)} >
                    <Image alt="pq search" src={"/images/pq-search.png"} width={40} height={40} className="mb-5" />
                    <div className="text-2xl my-2 text-gray-900 font-bold">Sign in</div>
                    <div className="text-gray-600 mb-6 text-sm">Welcome back! Please enter your details.</div>
                    <span className="text-gray-700 text-sm mb-1">Email</span>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="mb-5">
                                <FormControl>
                                    <Input disabled={isLoading} className={`${commonClasses}`} placeholder="Enter email" {...field} />
                                </FormControl>
                                <FormMessage />

                            </FormItem>
                        )}
                    />
                    <span className="text-gray-700 text-sm mb-1">Password</span>

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="password" autoComplete="on" disabled={isLoading} placeholder="Enter password" className={`${commonClasses}`} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Link href={"/forgotpassword"} className="text-purple-700 font-bold my-6 text-sm">Forgot password</Link>
                    <Button ref={buttonRef} variant={"default"} disabled={isLoading} type="submit" className="flex flex-row gap-2">
                        {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                        Sign in
                    </Button>
                    <div className="text-gray-400 font-medium flex my-4 flex-row justify-center">OR</div>
                    {/* <Button variant={"google"} disabled={isLoading} >
                    <Image src="/google.png" className="mr-3" height={24} width={24} alt="google search icon" /> Sign in with Google
                </Button> */}

                </form>
            </Form>
            <div className="flex flex-row justify-center w-full">
                <GoogleOAuthProvider clientId="272679518967-j4530tj210q5k9mud5kmrtsg6e40kd06.apps.googleusercontent.com">
                    {<GoogleLogin
                        // size="large"
                        width={googleWidth}
                        // width={"1000px"}
                        size="large"

                        onSuccess={credentialResponse => {
                            if (credentialResponse.credential) {
                                console.log(credentialResponse)
                                const jwt = parseJwt(credentialResponse.credential)
                                console.log(jwt)
                                signinWithGoogle(jwt)
                            }
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />}
                </GoogleOAuthProvider>
            </div>
        </div>
    </div>
}

