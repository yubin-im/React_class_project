import React, { useEffect, useState } from "react";
import { app } from "../../firebaseinit";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import { Button, Table } from "react-bootstrap";

const Cart = () => {
  const uid = sessionStorage.getItem("uid");
  const db = getDatabase(app);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const callAPI = () => {
    setLoading(true);
    onValue(ref(db, `cart/${uid}`), (snapshot) => {
      const rows = [];
      snapshot.forEach((row) => {
        rows.push({ key: row.key, ...row.val() });
      });
      setBooks(rows);
    });
    setLoading(false);
  };

  // 장바구니 삭제하기
  const onClickDelete = (book) => {
    if (window.confirm(`${book.title}을 장바구니에서 삭제하시겠습니까?`)) {
      remove(ref(db, `cart/${uid}/${book.isbn}`));
    }
  };

  // 가격 콤마 찍기
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  useEffect(() => {
    callAPI();
  }, []);

  if (loading) return <h1 className="my-5">Loading...</h1>;
  return (
    <div>
      <h1 className="my-5">장바구니</h1>

      <Table>
        <thead>
          <tr>
            <td colSpan={2}>도서 제목</td>
            <td>가격</td>
            <td>저자</td>
            <td>삭제</td>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.isbn}>
              <td>
                <img src={book.thumbnail} width="50px" />
              </td>
              <td>{book.title}</td>
              <td>{formatPrice(book.price)}</td>
              <td>{book.authors}</td>
              <td>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => onClickDelete(book)}
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Cart;
