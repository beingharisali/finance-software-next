
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { fullname, email, password, role } = await req.json();

    console.log("Register endpoint hit:", { fullname, email, role });

    if (!fullname || !email || !password) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        user: {
          id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          role: newUser.role,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in register:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
