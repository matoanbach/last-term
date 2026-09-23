import { userAuthentication } from "@/userAuthentication";
import { Redirect } from "expo-router";

export default function Index() {

  const user=userAuthentication(); //null (not logged in)-->signIn, User object (logged in)-->BookList, undefined (auth loading)

  if(user===undefined) {
    return null; //still loading-show nothing
  }

  if(!user) {
    return <Redirect href="/signIn" />; //not logged in --> go to Sign In
  }

  return <Redirect href="/BookList" />; //logged in--> go to Book List

}
