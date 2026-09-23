import { userAuthentication } from "@/userAuthentication";
import { Redirect } from "expo-router";

export default function Index() {
  const user = userAuthentication();

  if (user === undefined) {
    return null;
  }

  if (!user) {
    return <Redirect href="/signIn" />;
  }

  return <Redirect href="/EventBoard" />;
}
