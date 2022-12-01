import { useEffect, useState } from "react";
import initializeAuthentication from "../Pages/Login/Firebase/firebase.init";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

initializeAuthentication();
const useFirebase = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [product, setProduct] = useState({});
  const [orderData,setOrderData] = useState({});
  const auth = getAuth();

  // user register
  const registerUser = (email, password, name, history) => {
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        console.log(result.user);
        updateProfile(auth.currentUser, {
          displayName: name,
        });
        saveUser(email, name);
        history.push("/");
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // user login

  const handleSignIn = (email, password, history, location) => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const dest_url = location?.state?.from || "/";
        setUser(result.user);

        history.push(dest_url);
      })
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  };

  const logOut = () => {
    signOut(auth)
      .then(() => {
        setUser({});
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // setAdminLoading(true);
        fetch(`${process.env.REACT_APP_MECHANIC}/users/${user.email}`)
          .then((res) => res.json())
          .then((data) => {
            if (data?.role === "Admin") {
              setAdmin(true);
            } else {
              setAdmin(false);
            }
          })
          .finally(() => {
            setAdminLoading(false);
          });
      } else {
      }
      setIsLoading(false);
    });
    return () => unsubscribed;
  });
  const saveUser = (email, displayName) => {
    const user = { email, displayName, role: "User" };
    fetch(`${process.env.REACT_APP_MECHANIC}/users`, {
      method: `POST`,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });
  };

  return {
    registerUser,
    user,
    error,
    product, setProduct,
    orderData,setOrderData,
    isLoading,
    logOut,
    handleSignIn,
    adminLoading,
    admin,
  };
};

export default useFirebase;
