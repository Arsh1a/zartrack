import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { readSession } from "@/lib/session";
import Logout from "./logout";

export default async function AccountPage() {
  const session = await readSession();

  if (!session) {
    throw new Error("Session not found");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 items-start">
        <p>{session.email}</p>
        <Logout />
      </CardContent>
    </Card>
  );
}
