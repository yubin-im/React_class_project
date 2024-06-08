import moment from "moment";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { app } from "../../firebaseinit";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const Comments = () => {
  const email = sessionStorage.getItem("email");
  const { id } = useParams();
  const db = getFirestore(app);

  const [contents, setContents] = useState("");

  // 미로그인 상태로 댓글 등록
  const onClickInsert = () => {
    sessionStorage.setItem("target", `/bbs/read/${id}`);
    window.location.href = "/login";
  };

  // 댓글 등록
  const onInsert = async () => {
    if (contents === "") {
      alert("댓글 내용을 입력하세요!");
      return;
    }

    const data = {
      pid: id,
      email,
      contents,
      date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    };

    await addDoc(collection(db, `/comments`), data);
    alert("댓글 등록이 완료되었습니다!");
    setContents("");
  };

  return (
    <div className="my-5">
      {!email ? (
        <div className="text-end">
          <Button onClick={onClickInsert}>댓글 등록</Button>
        </div>
      ) : (
        <div>
          <Form.Control
            as="textarea"
            rows={5}
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            placeholder="댓글 내용을 입력하세요."
          />
          <div className="text-end mt-2">
            <Button className="px-5" onClick={onInsert}>
              등록
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
