import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { User as FirebaseUser } from "firebase/auth";

export function useAuth() {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Regenerate the token and save it in localStorage
                const token = await currentUser.getIdToken();
                localStorage.setItem("authToken", token);
                setUser(currentUser);
            } else {
                localStorage.removeItem("authToken"); // Clear token if user is logged out
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup the listener on unmount
    }, []);

    return { user, loading };
}
