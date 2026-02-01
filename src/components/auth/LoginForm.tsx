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

import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema, LoginSchemaType } from "@/schema/userSchema"
import { AuthUser, useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter(); 
  const { setUser } = useAuthStore.getState();
  const { register, formState: { isLoading, errors }, reset, handleSubmit } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const submithandler = async(data: LoginSchemaType) => {
    try {
      const response  = await fetch('/api/auth/login', {
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

      if(response.status === 404 || response.status === 401) {
        const responseData = await response.json();
        toast.error(responseData.message);
      }

    } catch (error) {
      reset();
      toast.error("Unexpected Error");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(submithandler)}>
            <div className="flex flex-col gap-1">
              <Label>Email</Label>
              <Input 
                placeholder="Enter your email address"
                type="text"
                {...register("email")}
              />
              {errors.email && ( <span className="text-sm text-destructive">{errors.email?.message}</span>)}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Password</Label>
              <Input 
                placeholder="Enter your email password"
                type="password"
                {...register("password")}
              />
              {errors.password && ( <span className="text-sm text-destructive">{errors.password?.message}</span>)}
            </div>
          <Button disabled={isLoading}>Login</Button>
          </form>

          <div className="mt-5">
            <span className="text-sm">Don't have account? <Link className="text-blue-500 underline " href={"/register"}>Create Account</Link></span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
