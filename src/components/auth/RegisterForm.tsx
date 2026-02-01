'use client';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "../ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { RegisterSchema, RegisterSchemaType } from "@/schema/userSchema"
import { AuthUser, useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter();
  const { setUser } = useAuthStore.getState()

  const { register, formState: { isLoading, errors }, reset, handleSubmit } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const submitHandler = async(data: RegisterSchemaType) => {
    try {
      const response  = await fetch('/api/auth/register', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if(response.ok) {
        const responseData = await response.json();
        const userData = responseData.data as AuthUser;
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name
        });
        toast.success(responseData.message);
        router.push('/tasks');
      }

      if(response.status === 403) {
        const responseData = await response.json();
        toast.error(responseData.message);
      }
    } catch (error) {
      toast("Unexpected Error");
    } finally {
      reset();
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Register to your account</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(submitHandler)}>
            <div className="flex flex-col gap-1">
              <Label>Name</Label>
              <Input 
                placeholder="Enter your name"
                type="text"
                {...register("name")}
              />
              {errors.name && (<span className="text-sm text-destructive">{errors.name?.message}</span>)}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Email</Label>
              <Input 
                placeholder="Enter your email address"
                type="text"
                {...register("email")}
              />
               {errors.email && (<span className="text-sm text-destructive">{errors.email?.message}</span>)}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Password</Label>
              <Input 
                placeholder="Enter your password"
                type="password"
                {...register("password")}
              />
              {errors.password && (<span className="text-sm text-destructive">{errors.password?.message}</span>)}
            </div>
            <Button disabled={isLoading}>Register</Button>
          </form>

          <div className="mt-5">
            <span className="text-sm">Already have account? <Link className="text-blue-500 underline " href={"/login"}>Login</Link></span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
