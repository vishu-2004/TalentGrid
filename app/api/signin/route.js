import {connect} from '@/utils/db'
import User from '@/models/User'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'



export async function POST(request) {
    try {
      let conn = await connect();
      const { Name, email, password, roleName } = await request.json();
      
      if (!Name || !email || !password || !roleName) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
      }
  
      const userExists = await User.findOne({ email });
      if (userExists) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
      }
  
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
  
      const newUser = new User({ name: Name, email, password: hashedPassword, role: roleName });
      await newUser.save();
  
      return NextResponse.json({ message: "User created successfully", success: true }, { status: 200 });
    } catch (error) {
      console.error("Error in /api/signin:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  