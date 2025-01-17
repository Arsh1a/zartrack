"use client";

import { authenticate, verifyAccount } from "./actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Authenticate,
  verifyAccountSchema,
  VerifyAccount,
  authenticateSchema,
} from "./schemas";
import { useSubmitForm } from "@/hooks/useFormSubmit";
import { useState } from "react";
import { PasswordInput } from "@/components/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [otpFormMessage, setOTPFormMessage] = useState<string | undefined>(
    undefined
  );
  return (
    <div className="h-full flex items-center w-full">
      {!otpFormMessage ? (
        <AuthenticateForm onSuccess={(msg) => setOTPFormMessage(msg)} />
      ) : (
        <LoginOTPForm message={otpFormMessage} />
      )}
    </div>
  );
}

function AuthenticateForm({
  onSuccess,
}: {
  onSuccess: (msg: string | undefined) => void;
}) {
  const form = useForm<Authenticate>({
    resolver: zodResolver(authenticateSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, isLoading } = useSubmitForm({
    action: authenticate,
    onSuccess: (res) => onSuccess(res?.message),
    setError: form.setError,
    disableLoadingReset: true,
  });

  const onSubmit = async (values: Authenticate) => {
    handleSubmit(values);
  };

  return (
    <Card className="w-full max-w-[500px] mx-auto my-auto">
      <CardHeader>
        <CardTitle className="text-center">Login/Signup</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 items-stretch"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function LoginOTPForm({ message }: { message: string }) {
  const router = useRouter();

  const form = useForm<VerifyAccount>({
    resolver: zodResolver(verifyAccountSchema),
    defaultValues: {
      code: "",
    },
  });

  const { handleSubmit, isLoading } = useSubmitForm({
    action: verifyAccount,
    setError: form.setError,
    disableLoadingReset: true,
    onSuccess: () => router.push("/portfolio"),
  });

  const onSubmit = async (values: VerifyAccount) => {
    handleSubmit(values);
  };

  return (
    <Card className="w-full max-w-[500px] mx-auto my-auto">
      <CardHeader>
        <CardTitle className="text-center">Verify your email</CardTitle>
        <CardDescription className="text-center">{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 items-stretch"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
