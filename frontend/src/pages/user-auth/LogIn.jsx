//hooks & utils
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

//ui-components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from 'sonner'

//icons
import { FcGoogle } from "react-icons/fc"
import { Loader2, Mail } from "lucide-react"

export default function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signInWithEmail, signInWithGoogle, isLoggedIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      setIsLoading(true)
      if(!isLoggedIn){ 
        await signInWithEmail({ email, password })
      }else{

        toast.info('Already Logged In', {
          description: 'You are already logged in. Redirecting to home page.',
          action: {
            label: 'Go to Home',
            onClick: () => navigate('/'),
          },
        });

      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen  backdrop-blur-[1px] flex items-center justify-center bg-background p-4">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Log in to your account</CardTitle>
          <CardDescription>
            Enter your credentials to log in
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2 mb-5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <Link
                to="#"
                className="text-primary-foreground hover:text-primary-foreground/90 dark:text-primary underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Log In
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="ghost" onClick={signInWithGoogle} className="w-full bg-muted">
            <FcGoogle className="mr-2 h-4 w-4" />
            Sign In With Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary-foreground hover:text-primary-foreground/90 dark:text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
