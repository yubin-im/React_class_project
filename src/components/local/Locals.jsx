import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { app } from "../../firebaseinit";
import { getDatabase, ref, set, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Locals = () => {
  const [query, setQuery] = useState("인하대학교");
  const [page, setPage] = useState(1);
  const [locals, setLocals] = useState([]);

  const [loading, setLoading] = useState(false);
  const navi = useNavigate();

  const db = getDatabase(app);
  const uid = sessionStorage.getItem("uid");

  const callAPI = async () => {
    setLoading(true);
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&size=10&page=${page}`;
    const config = {
      headers: { Authorization: "KakaoAK 29e9e1950348691f626373bb936f8182" },
    };
    const res = await axios.get(url, config);
    setLocals(res.data.documents);
    setLoading(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (query === "") {
      alert("검색어를 입력해주세요.");
    } else {
      callAPI();
    }
  };

  const onClickFavorite = (local) => {
    if (!uid) {
      alert("먼저 로그인을 해주세요.");
      sessionStorage.setItem("target", "/locals");
      navi("/login");
      return;
    }

    if (window.confirm("즐겨찾기에 추가하시겠습니까?")) {
      // 즐겨찾기 중복 등록 체크
      get(ref(db, `favorite/${uid}/${local.id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          alert("이미 즐겨찾기에 등록되었습니다.");
        } else {
          set(ref(db, `favorite/${uid}/${local.id}`), local);
          alert("즐겨찾기에 등록되었습니다!");
        }
      });
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  if (loading) return <h1 className="my-5">Loading...</h1>;

  return (
    <div>
      <h1 className="my-5">지역검색</h1>

      <Row className="mb-2">
        <Col xs={8} md={6} lg={4}>
          <Form onSubmit={onSubmit}>
            <InputGroup>
              <Form.Control
                placeholder="검색어를 입력하세요."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              ></Form.Control>
              <Button type="submit">검색</Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <td>ID</td>
            <td>장소명</td>
            <td>주소</td>
            <td>전화</td>
            <td>즐겨찾기</td>
          </tr>
        </thead>
        <tbody>
          {locals.map((local) => (
            <tr key={local.id}>
              <td>{local.id}</td>
              <td>{local.place_name}</td>
              <td>{local.address_name}</td>
              <td>{local.phone}</td>
              <td className="text-center">
                <Button
                  variant="warning"
                  onClick={() => onClickFavorite(local)}
                >
                  즐겨찾기
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Locals;
