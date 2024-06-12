import axios from "axios";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, InputGroup, Form, Button } from "react-bootstrap";
import { BsCartPlusFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { app } from "../../firebaseinit";
import { getDatabase, ref, set, get } from "firebase/database";

const Books = () => {
  const db = getDatabase(app);
  const uid = sessionStorage.getItem("uid");
  const navi = useNavigate();

  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("리액트");
  const [page, setPage] = useState(1);

  const callAPI = async () => {
    setLoading(true);
    const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=12&page=${page}`;
    const config = {
      headers: { Authorization: "KakaoAK 29e9e1950348691f626373bb936f8182" },
    };
    const res = await axios.get(url, config);
    setBooks(res.data.documents);
    setLoading(false);
  };

  useEffect(() => {
    callAPI();
  }, [page]);

  const onSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    callAPI();
  };

  // 장바구니에 도서 넣기
  const onClickCart = (book) => {
    if (uid) {
      if (window.confirm(`${book.title}를 장바구니에 넣으시겠습니까?`)) {
        // 장바구니 중복 체크
        get(ref(db, `cart/${uid}/${book.isbn}`)).then((snapshot) => {
          if (snapshot.exists()) {
            alert("이미 장바구니에 존재합니다.");
          } else {
            set(ref(db, `cart/${uid}/${book.isbn}`), { ...book });
            alert("장바구니에 넣었습니다!");
          }
        });
      }
    } else {
      alert("로그인이 필요합니다.");
      sessionStorage.setItem("target", "/books");
      navi("/login");
    }
  };

  if (loading) return <h1 className="my-5">Loading...</h1>;
  return (
    <div>
      <h1 className="my-5">도서검색</h1>

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

      <Row>
        {books.map((book) => (
          <Col key={book.isbn} xs={6} md={3} lg={2} className="mb-2">
            <Card>
              <Card.Body className="justify-content-center d-flex">
                <img
                  src={book.thumbnail || "http://via.placeholder.com/120x170"}
                />
              </Card.Body>
              <Card.Footer>
                <div className="ellipsis">{book.title}</div>
                <BsCartPlusFill
                  style={{
                    cursor: "pointer",
                    fontSize: "20px",
                    color: "green",
                  }}
                  onClick={() => onClickCart(book)}
                />
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center my-3">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
          이전
        </Button>
        <span className="mx-2">{page}</span>
        <Button onClick={() => setPage(page + 1)}>다음</Button>
      </div>
    </div>
  );
};

export default Books;
