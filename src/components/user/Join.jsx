import React, { useState } from "react";
import { Row, Col, Form, InputGroup, Card, Button } from "react-bootstrap";
import { app } from "../../firebaseinit";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Join = () => {
  const auth = getAuth(app);
  const [loading, setLoading] = useState(false);
  const navi = useNavigate();

  const [form, setForm] = useState({});
  const { email, pass } = form; // 비구조 할당 (form.email으로 사용 가능)

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 회원가입
  const onSubmit = (e) => {
    e.preventDefault();
    if (email === "" || pass === "") {
      alert("이메일과 비밀번호를 입력해주세요!");
    } else {
      setLoading(true);

      // 이메일 가입
      createUserWithEmailAndPassword(auth, email, pass)
        .then((success) => {
          alert("회원가입 성공!");
          setLoading(false);
          navi("/login");
        })
        .catch((error) => {
          alert("에러 발생: " + error);
          setLoading(false);
        });
    }
  };

  if (loading) return <h1 className="my-5">로딩중...</h1>;

  return (
    <Row className="my-5 justify-content-center">
      <Col md={6}>
        <Card>
          <Card.Header>
            <h3 className="text-center">회원가입</h3>
          </Card.Header>
          <Card.Body>
            <form onSubmit={onSubmit}>
              <InputGroup className="mb-2">
                <InputGroup.Text
                  style={{ width: 100 }}
                  className="justify-content-center"
                >
                  이메일
                </InputGroup.Text>
                <Form.Control
                  name="email"
                  value={form.email}
                  onChange={onChange}
                ></Form.Control>
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text
                  style={{ width: 100 }}
                  className="justify-content-center"
                >
                  비밀번호
                </InputGroup.Text>
                <Form.Control
                  name="pass"
                  type="password"
                  value={form.pass}
                  onChange={onChange}
                ></Form.Control>
              </InputGroup>
              <div>
                <Button className="w-100" type="submit">
                  회원가입
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Join;
