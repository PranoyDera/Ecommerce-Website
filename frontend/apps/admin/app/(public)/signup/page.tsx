"use client";

import { apiPost } from "@/app/utils/api";
import AuthForm from "@/components/Authform";
import { useState } from "react";
import { toast } from "sonner";

export default function SignupPage() {

const [loading, setLoading] = useState(false);

const handleSignup = async (form: Record<string, string>) => {

  if (!form.email || !form.password || !form.gender || !form.phone) {
    toast.error("All fields are required");
    return;
  }

  if (form.phone.length !== 10) {
    toast.error("Phone number must be 10 digits");
    return;
  }

  try {
    setLoading(true);

    const res = await apiPost<{ message: string,success:boolean }>("/api/admin/register", form);
    console.log("Response:",res);
    if(res.success===true){
    toast.success(res.message);
    }
  } catch (err: any) {
    toast.error(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="h-screen flex justify-center items-center bg-black">
      <AuthForm
        title="Create Account"
        submitLabel={loading ? "Creating..." : "Sign Up"}
        onSubmit={async (data) => {
          handleSignup(data);
        }}
        fields={[
            {
            name: "name",
            type: "text",
            label: "Name",
            placeholder: "Enter name",
          },
          {
            name: "email",
            type: "email",
            label: "Email",
            placeholder: "Enter email",
          },
          {
            name: "password",
            type: "password",
            label: "Password",
            placeholder: "Enter password",
          },
          {
            name: "gender",
            type: "select",
            label: "Gender",
            placeholder:"Select your gender",
            options: [
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ],
          },
          {
            name: "phone",
            type: "phone",
            label: "Phone Number",
            placeholder: "9876543210",
          },
        ]}
        footerText="Already have an account?"
        footerLink={{ href: "/login", label: "Login" }}
        className="w-[30%]!"
      />
    </div>
  );
}
