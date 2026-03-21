import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import { connectDatabase } from "../config/db.js";
import { Application } from "../models/Application.js";
import { User } from "../models/User.js";

dotenv.config();

const run = async () => {
  await connectDatabase();

  const email = "demo@example.com";
  const username = "demo";
  const password = await bcrypt.hash("demo12345", 10);
  const today = new Date();
  const day = 24 * 60 * 60 * 1000;

  let user = await User.findOne({ username });
  if (!user) {
    user = await User.create({ username, email, password });
  } else {
    user.password = password;
    user.email = email;
    await user.save();
  }

  await Application.deleteMany({ user: user._id });

  await Application.insertMany([
    {
      user: user._id,
      companyName: "Google",
      role: "Software Engineer Intern",
      location: "Bengaluru",
      salaryRange: "70k stipend",
      status: "interview",
      jobType: "internship",
      source: "Careers Page",
      applicationLink: "https://careers.google.com",
      contactName: "Priya Sharma",
      contactEmail: "priya@example.com",
      priority: "high",
      resumeVersion: "Internship Resume v3",
      nextStep: "Prepare DSA revision and project walkthroughs",
      lastContactedOn: new Date(today.getTime() - day),
      dateApplied: new Date(today.getTime() - 9 * day),
      followUpDate: new Date(today.getTime() + 2 * day),
      notes: "Strong match for backend and problem-solving rounds."
    },
    {
      user: user._id,
      companyName: "Microsoft",
      role: "Frontend Developer",
      location: "Hyderabad",
      salaryRange: "14-18 LPA",
      status: "screening",
      jobType: "full-time",
      source: "LinkedIn",
      applicationLink: "https://careers.microsoft.com",
      contactName: "Aarav Mehta",
      contactEmail: "aarav@example.com",
      priority: "high",
      resumeVersion: "Frontend Resume v2",
      nextStep: "Send portfolio and JavaScript project links",
      lastContactedOn: new Date(today.getTime() - 3 * day),
      dateApplied: new Date(today.getTime() - 7 * day),
      followUpDate: new Date(today.getTime() + day),
      notes: "Highlight tracker UI and responsive frontend work."
    },
    {
      user: user._id,
      companyName: "Amazon",
      role: "SDE I",
      location: "Chennai",
      salaryRange: "16-22 LPA",
      status: "applied",
      jobType: "full-time",
      source: "Referral",
      applicationLink: "https://amazon.jobs",
      contactName: "Neha Kapoor",
      contactEmail: "neha@example.com",
      priority: "medium",
      resumeVersion: "General SDE Resume",
      nextStep: "Wait for OA invite and revise aptitude basics",
      lastContactedOn: new Date(today.getTime() - 5 * day),
      dateApplied: new Date(today.getTime() - 5 * day),
      followUpDate: new Date(today.getTime() + 4 * day),
      notes: "Referral submitted through alumni network."
    },
    {
      user: user._id,
      companyName: "Infosys",
      role: "Systems Engineer",
      location: "Pune",
      salaryRange: "4.5-6.5 LPA",
      status: "offer",
      jobType: "full-time",
      source: "Campus Placement",
      applicationLink: "https://www.infosys.com/careers/",
      contactName: "Rahul Verma",
      contactEmail: "rahul@example.com",
      priority: "high",
      resumeVersion: "Placement Resume Final",
      nextStep: "Compare offer with interview pipeline",
      lastContactedOn: today,
      dateApplied: new Date(today.getTime() - 18 * day),
      followUpDate: new Date(today.getTime() + 3 * day),
      notes: "Offer received. Waiting for final joining details."
    },
    {
      user: user._id,
      companyName: "Adobe",
      role: "UI Engineer Intern",
      location: "Noida",
      salaryRange: "85k stipend",
      status: "wishlist",
      jobType: "internship",
      source: "LinkedIn",
      applicationLink: "https://careers.adobe.com",
      contactName: "Karan Malhotra",
      contactEmail: "karan@example.com",
      priority: "medium",
      resumeVersion: "Design + Frontend Resume",
      nextStep: "Tailor portfolio and motion project examples",
      dateApplied: today,
      followUpDate: new Date(today.getTime() + 7 * day),
      notes: "Dream internship. Needs stronger portfolio packaging."
    }
  ]);

  console.log("Demo user ready: demo / demo12345");
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
