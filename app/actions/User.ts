import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function createUser(user : any){
    try{
        await dbConnect();
        const newUser = await User.create(user);
        if(!newUser){
            return NextResponse.json({ success: false, message: "Invalid format" }, { status: 400 });
        }
        return NextResponse.json({ success: true, newUser }, { status: 201 });
        } 
    catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 },
        );
    }
}

export async function deleteUser(user : any){
    try{
        await dbConnect();
        const result = await User.deleteOne(user);
        if(result.deletedCount === 0){
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "User deleted successfully", result }, { status: 200 });
        } 
    catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 },
        );
    }
}