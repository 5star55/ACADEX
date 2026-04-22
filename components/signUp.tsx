'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
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

const signUpSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z.string().email("Enter a valid email"),
    confirmEmail: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.email === data.confirmEmail, {
    path: ["confirmEmail"],
    message: "Emails do not match",
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

type FieldErrors = Partial<
  Record<
    | "firstName"
    | "lastName"
    | "email"
    | "confirmEmail"
    | "password"
    | "confirmPassword"
    | "form",
    string
  >
>

export default function SignUp() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  function validateField(
    field:
      | "firstName"
      | "lastName"
      | "email"
      | "confirmEmail"
      | "password"
      | "confirmPassword",
  ) {
    const result = signUpSchema.safeParse({
      firstName,
      lastName,
      email,
      confirmEmail,
      password,
      confirmPassword,
    })

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

    const result = signUpSchema.safeParse({
      firstName,
      lastName,
      email,
      confirmEmail,
      password,
      confirmPassword,
    })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors({
        firstName: fieldErrors.firstName?.[0],
        lastName: fieldErrors.lastName?.[0],
        email: fieldErrors.email?.[0],
        confirmEmail: fieldErrors.confirmEmail?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      })
      return
    }

    try {
      setIsSubmitting(true)
      setErrors({})
      setSuccess(false)

      const { error } = await authClient.signUp.email({
        email: result.data.email,
        password: result.data.password,
        name: `${result.data.firstName} ${result.data.lastName}`.trim(),
      })

      if (error) {
        setErrors({ form: error.message || "Unable to sign up right now" })
        return
      }

      setFirstName("")
      setLastName("")
      setEmail("")
      setConfirmEmail("")
      setPassword("")
      setConfirmPassword("")
      setSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto mt-10 mb-10 flex w-fit flex-col items-center justify-center">
      <h1 className="text-2xl font-extrabold">Welcome to AcaDex</h1>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardDescription />
          <CardAction>
            <Button variant="link">
              <Link href="/login">Log In</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <div className="grid gap-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  type="text"
                  required
                  value={firstName}
                  onBlur={() => validateField("firstName")}
                  onChange={(event) => setFirstName(event.target.value)}
                />
                {errors.firstName ? (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  type="text"
                  required
                  value={lastName}
                  onBlur={() => validateField("lastName")}
                  onChange={(event) => setLastName(event.target.value)}
                />
                {errors.lastName ? (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                ) : null}
              </div>

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
                <Label htmlFor="confirm_email">Confirm Email</Label>
                <Input
                  id="confirm_email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={confirmEmail}
                  onBlur={() => validateField("confirmEmail")}
                  onChange={(event) => setConfirmEmail(event.target.value)}
                />
                {errors.confirmEmail ? (
                  <p className="text-sm text-red-500">{errors.confirmEmail}</p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
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

              <div className="grid gap-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  required
                  value={confirmPassword}
                  onBlur={() => validateField("confirmPassword")}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                {errors.confirmPassword ? (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                ) : null}
              </div>

              {errors.form ? (
                <p className="text-sm text-red-500">{errors.form}</p>
              ) : null}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Sign Up"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
          {success ? (
            <p className="text-sm text-green-700">
              You have signed up successfully. You can now log in.
            </p>
          ) : null}
          <div className="flex items-center">
            <p>Already have an account?</p>
            <Button variant="link">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>

    </div>
  )
}
