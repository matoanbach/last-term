import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebaseAuth } from "./firebaseConfig";

export function userAuthentication() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (authUser) => {
      setUser(authUser);
    });

    return unsubscribe;
  }, []);

  return user;
}
