import { NextResponse } from "next/server";
import fs from "fs"
import path from "path"

const dataFrom = path.join(process.cwd(), "data", "temp.json")
export async function GET() {
   const dummyTempData = fs.readFileSync(dataFrom, "utf-8")
   return NextResponse.json(JSON.parse(dummyTempData))
}