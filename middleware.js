import { NextResponse } from "next/server";
import { currentDomain } from "./const";
import { jwtVerify } from "jose";

const secret = process.env.JDUB

export default async function middleware(req) {

    const token = req.cookies.get("auth")?.value
    const url = req.url
    const secret = new TextEncoder().encode(process.env.JDUB)

    if (url.includes("/app")) {
        
        if (token === undefined) {
            console.log("no token found")
            return NextResponse.redirect(`${currentDomain}/`)
        }
        try {
            console.log("attempting to verify")
            await jwtVerify(token, secret)
            console.log("verified")
            return NextResponse.next()
        } catch (e) {
            console.log(e)
            return NextResponse.redirect(`${currentDomain}/`)
        }
    }

    return NextResponse.next()
}