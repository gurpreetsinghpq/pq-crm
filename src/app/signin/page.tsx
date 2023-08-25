import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import Image from "next/image"

export default function Signin() {
    return <div className="signin-container flex min-h-screen">
        <div className="left flex flex-col w-7/12 bg-purple-600 px-10 py-10 ">
            <div className="flex flex-row mb-8">
                <Image src={"/purple-quarter-logo.png"} alt="purple search logo" width={167} height={44} />
            </div>
            <div className="flex flex-col">
                <div className="flex flex-row justify-center">
                    <Image src={"/carousel-1.png"} alt="carousel first" width={596} height={411} />
                </div>
                <div className="flex flex-col justify-center align-middle mt-10">
                    <h2 className="text-white-900 text-2xl text-center mb-1 font-semibold">Automate your workflow in 3..2..1</h2>
                    <h3 className="text-purple-200 text-center text-base py-1">This is the description text here. This could be a <br/> two liner as well, and little longer if needed.</h3>
                </div>
            </div>
        </div>
        <div className="right px-12 py-6 w-5/12 justify-center flex flex-col">
            <Image alt="pq search" src={"/pq-search.png"} width={40} height={40} className="mb-5" />
            <h1 className="text-2xl my-2 text-gray-900 font-bold">Sign in</h1>
            <h2 className="text-gray-600 mb-6 text-sm">Welcome back! Please enter your details.</h2>
            <span className="text-gray-700 text-sm mb-1">Email</span>
            <Input name="email" type="email" className="mb-5" placeholder="Enter email" />
            <span className="text-gray-700 text-sm mb-1">Password</span>
            <Input name="password" type="password" placeholder="Enter password" />
            <a className="text-purple-700 font-bold my-6 text-sm">Forgot password</a>
            <Button variant={"default"} >Sign in</Button>
            <div className="text-gray-400 font-medium flex my-4 flex-row justify-center">OR</div>
            <Button variant={"google"} >
                <Image src="/google.png" className="mr-3" height={24} width={24} alt="google search icon" /> Sign in with Google
            </Button>
        </div>
    </div>
}

