import { useRef, useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth, db, storage } from "../src/firebase";
import FileUpload from "./FileUpload";
import { AuthContext } from "./auth";
import "./SelectedUser.css";
import SendIcon from "@mui/icons-material/Send";
import UploadIcon from "@mui/icons-material/Upload";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
  QuerySnapshot,
  setDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject
} from "firebase/storage";
import Messages from "./Messages";
import { usePageVisibility } from "react-page-visibility";

export default function SelectedUser() {
  const { user } = useContext(AuthContext);
  const user1id = user.uid;
  console.log(user1id);
  let location = useLocation();
  const user2 = location.state;
  var isVisible = usePageVisibility();

  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [data, setData] = useState("");
  const [uploading, setUploading] = useState(false);

  const user2uid = user2.uid;
  const id =
    user1id > user2uid ? `${user1id + user2uid}` : `${user2uid + user1id}`;
  const addDocMsg = async (url) => {
    await addDoc(collection(db, "messages", id, "chat"), {
      text,
      from: user1id,
      to: user2uid,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || ""
    });
    await setDoc(doc(db, "lastMsg", id), {
      text,
      from: user1id,
      to: user2uid,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true
    });
    setText("");
    setImg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let url;
    if (img) {
      setUploading(true);
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;

      addDocMsg(url);
      setUploading(false);
      return;
    }
    addDocMsg();
  };

  useEffect(() => {
    const msgRef = collection(db, "messages", id, "chat");
    const _q = query(msgRef, orderBy("createdAt", "asc"));
    onSnapshot(_q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);
  useEffect(() => {
    console.log("file uploaded");
  }, [setImg]);

  useEffect(async () => {
    console.log(isVisible);
    await updateDoc(doc(db, "users", user.uid), {
      isOnline: isVisible
    });
    user2.isOnline = isVisible;
  }, [isVisible]);
  console.log(data);
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
                float: "left",
                cursor: "pointer",
                color: "#502A75"
              }}
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
                clip-rule="evenodd"
              />
            </svg>
          </Link>
          <div style={{ textAlign: "center", marginBottom:'15px' }}>
            <h2
              style={{
                marginTop: "10px"
              }}
            >
              {user2.name}{" "}
              {user2.isOnline ? (
                <span style={{ color: "green" }}>•</span>
              ) : (
                <span style={{ color: "red" }}>•</span>
              )}
            </h2>
            <small >{user2.email}</small>
            
          </div>

          <div
            style={{
              height: "400px",
              overflowY: "auto",
              backgroundColor: "#eaebff",
              padding: "7px",
              marginLeft: "-10px",
              marginRight: "-10px",
              borderRadius: "5px"
            }}
            className="new"
          >
            {msgs.length
              ? msgs.map((msg, i) => (
                  <Messages msg={msg} user1id={user1id} user2={user2} />
                ))
              : null}
          </div>

          {/* <div
            style={{
              height: "50px",
              padding: "7px",
              marginLeft: "-8px",
              marginRight: "-10px"
            }}
          >
            <div
              style={{
                height: "100%",
                width: "10%",
                backgroundColor: "#eaebff",
                marginLeft: "-10px",
                marginRight: "1%",
                float: "left"
              }}
            >
              <label>
                <svg
                  style={{
                    height: "35px",
                    width: "35px",
                    padding: "5px",
                    cursor: "pointer"
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <input
                  onChange={(e) => setImg(e.target.files[0])}
                  type="file"
                  id="img"
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <div style={{ height: "100%", width: "75%", float: "left" }}>
              <textarea
                style={{
                  padding: "5px",
                  width: "100%",

                  height: "40px",
                  background: "#eaebff",
                  overflow: "hidden",
                  border: "none",
                  resize: "none"
                }}
                type="text"
                placeholder="Type your message... "
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
            </div>
            <div
              style={{
                height: "100%",
                width: "15%",
                backgroundColor: "#eaebff",
                marginLeft: "-7px",
                float: "right"
              }}
            >
              <svg
                style={{
                  height: "35px",
                  width: "35px",
                  padding: "5px",
                  cursor: "pointer"
                }}
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div> */}
          <div style={{
              
              marginLeft: "-18px",
              marginRight: "-18px"
            }}>
          <div className="messageBox">
            <input
              onChange={(e) => setImg(e.target.files[0])}
              type="file"
              id="upimg"
              accept="image/*"
              style={{ display: "none" }}
            />

            <button
              id="linkCopy"
              className="button-s1"
              tooltip="Copy Link"
              flow="up"
              onClick={() => {
                document.getElementById("upimg").click();
              }}
            >
              <span className="material-icons">
                <UploadIcon />
              </span>
            </button>

            <div className="textA">
              <textarea
                id="message"
                name="message"
                rows={1}
                cols={30}
                placeholder="Type your message here"
                defaultValue={""}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <button
              onClick={(e) => handleSubmit(e)}
              id="send"
              className="button-s1"
              tooltip="Send"
              flow="left"
            >
              <span className="material-icons headerIcon">
                <SendIcon />
              </span>
            </button>
          </div>
          </div>

          {/* <form style={{ display: "flex" }} onSubmit={handleSubmit}>
            <div>
              <label>
                <FileUpload />
                <input
                  onChange={(e) => setImg(e.target.files[0])}
                  type="file"
                  id="img"
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <div>
              <input
                style={{ padding: "5px" }}
                type="text"
                placeholder="Type your message... "
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></input>
            </div>
            <div>
              <button style={{ padding: "5px" }}>Send</button>
            </div>
          </form> */}
          {img ? <p>{img.name}</p> : ""}
          {uploading ? "Please Wait.. File is uploading" : ""}
        </div>
      </main>
    </div>
  );
}
