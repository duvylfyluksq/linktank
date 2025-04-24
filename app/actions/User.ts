import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function createUser(user : any){
    try{
        await dbConnect();

        const stripeCustomer = await stripe.customers.create({
          email: user.email,
        });
        
        user.stripe_id = stripeCustomer.id;
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
        const existingUser = await User.findOne(user);

        if (!existingUser) {
          return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (existingUser.stripe_id) {
          await stripe.customers.del(existingUser.stripe_id);
        }

        const result = await User.deleteOne({ _id: existingUser._id });

        return NextResponse.json(
          { success: true, message: "User deleted successfully", result },
          { status: 200 }
        );
    } 
    catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 },
        );
    }
}

export async function updateUser(user: any) {
    try {
      await dbConnect();
      const result = await User.updateOne(
        { clerk_id: user.clerk_id },
        { $set: user }
      );
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }
      // if (result.modifiedCount === 0){
      //   return NextResponse.json(
      //       { success: true, message: "No changes made" },
      //       { status: 204 }
      //     );
      // }
      return NextResponse.json(
        { success: true, message: "User updated successfully", result}, { status: 200 }
      );
    } 
    catch (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { success: false, message: "Server error" },
        { status: 500 }
      );
    }
  }