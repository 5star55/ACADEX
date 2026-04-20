'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { useState } from "react"
import { z } from "zod"
import { useRouter } from "next/navigation"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FieldErrors = Partial<Record<"email" | "password" | "form", string>>

export default function Login() {
  const router=useRouter();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validateField(field: "email" | "password") {
    const result = loginSchema.safeParse({ email, password })

    if (result.success) {
      setErrors((current) => ({ ...current, [field]: undefined, form: undefined }))
      return
    }

    const fieldError = result.error.flatten().fieldErrors[field]?.[0]
    setErrors((current) => ({
      ...current,
      [field]: fieldError,
      form: undefined,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = loginSchema.safeParse({ email, password })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      })
      return
    }

    try {
      setIsSubmitting(true)
      setErrors({})

      const { error } = await authClient.signIn.email({
        email: result.data.email,
        password: result.data.password,
      })

      if (error) {
        setErrors({ form: error.message || "Unable to log in right now" })
        return
      }

      router.push("/materials")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto mt-20 mb-10 flex w-fit justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <div className="text-center text-2xl">Login to your account</div>
          </CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onBlur={() => validateField("email")}
                  onChange={(event) => setEmail(event.target.value)}
                />
                {errors.email ? (
                  <p className="text-sm text-red-500">{errors.email}</p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onBlur={() => validateField("password")}
                  onChange={(event) => setPassword(event.target.value)}
                />
                {errors.password ? (
                  <p className="text-sm text-red-500">{errors.password}</p>
                ) : null}
              </div>

              {errors.form ? (
                <p className="text-sm text-red-500">{errors.form}</p>
              ) : null}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="flex items-center">
            <p>Don&apos;t have an account?</p>
            <Button variant="link">
              <Link href="/signUp">Sign Up</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
