import DisabledFeature from "@/components/disabled-feature";
import AuthForm from "./auth-form";

export default async function LoginPage() {
  const disableAuth = process.env.DISABLE_AUTH === "true";
  if (disableAuth) {
    return <DisabledFeature />;
  }
  return <AuthForm />;
}
