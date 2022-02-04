import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth, db } from "../src/firebase";
import { useHistory } from "react-router-dom";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "./auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { usePageVisibility } from "react-page-visibility";
import "./Dashboard.css";

export default function Dashboard() {
  const isVisible = usePageVisibility();

  const { user } = useContext(AuthContext);

  const history = useHistory();

  const location = useLocation();

  const handleSignOut = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      isOnline: false
    });
    await signOut(auth);
    history.push("/");
  };

  const [users, setUsers] = useState([]);
  const [myuser, setMyUser] = useState([]);

  useEffect(() => {
    const usersRef = collection(db, "users");

    // create query object
    const myname = query(usersRef, where("uid", "in", [auth.currentUser.uid]));

    console.log("hi--", myname);
    const q = query(usersRef);
    //execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setMyUser(users.find((e) => e.uid === auth.currentUser.uid));
      setUsers(users.filter((e) => e.uid != auth.currentUser.uid));
    });
    return () => unsub();
  }, []);

  console.log(myuser);

  return (
    <div>
      <header class="myHeader">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{
              width: "50px",
              height: "50px",
              position: "absolute",
              float: "left"
            }}
          >
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        </span>
        <h1
          style={{
            textAlign: "center",
            marginLeft: "50px",
            marginTop: "15px",
            fontSize: "35px"
          }}
        >
          Web Chat Pingo!
        </h1>
      </header>
      <main>
        <div className="content">
          <Link to="/dashboard">
            <svg
              style={{
                width: "30px",
                height: "30px",
                float: "right",
                cursor: "pointer",
                color: "#502A75"
              }}
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => handleSignOut()}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />{" "}
            </svg>
          </Link>
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <h2
              style={{
                marginTop: "10px"
              }}
            >
              Available User
            </h2>
          </div>

          <div className="new">
            <div
              style={{
                height: "450px",
                overflowY: "auto",

                padding: "7px",
                marginLeft: "-10px",
                marginRight: "-10px",
                borderRadius: "5px"
              }}
              className="container"
            >
              {users.map((user) => {
                return (
                  <Link
                    to={{
                      pathname: `/user/${user.name}`,
                      state: user,
                      isVisible: isVisible
                    }}
                  >
                    <div className="box">
                      <p style={{ fontSize: 20, fontWeight: "bold" }}>
                        {user.name}

                        {user.isOnline ? (
                          <span style={{ color: "green" }}> •</span>
                        ) : (
                          <span style={{ color: "red" }}> •</span>
                        )}
                      </p>
                      <p style={{ fontSize: "small" }}>{user.email}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
