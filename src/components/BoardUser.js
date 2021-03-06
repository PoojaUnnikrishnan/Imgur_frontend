import React, { useState, useEffect, useRef } from "react";
import userService from "../services/user.service";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
const user = JSON.parse(localStorage.getItem("user"));

const BoardUser = () => {
  const form = useRef();
  const [category, setCategory] = useState("");
  const [content, setContent] = useState([]);
  const onChangeCategory = (e) => {
    const category = e.target.value;
    setCategory(category);
  };

  const toggleLike = (id) => {
    console.log(id);
    userService.toggleLike(id).then(() => {
      window.location.reload();
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(category);
    userService.searchImage(category).then((response) => {
      console.log(response.data.data);
      setContent(response.data.data);
    });
  };
  useEffect(() => {
    userService.getPublicContent().then(
      (response) => {
        setContent(response.data.data);
        console.log(response.data.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        // setContent(_content);
        console.log(_content);
      }
    );
  }, []);
  return (
    <div className="row">
      <Form onSubmit={handleSubmit} ref={form}>
        <Form.Group className="mb-3" controlId="formCategory">
          <Form.Label style={{ fontSize: "25px", fontFamily: "serif" }}>
            <b>Category</b>
          </Form.Label>
          <Form.Control
            type="search"
            name="category"
            onChange={onChangeCategory}
            placeholder="Enter Category"
            value={category}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          style={{
            width: "90px",
            height: "35px",
            fontSize: "15px",
          }}
        >
          Submit
        </Button>
        <br></br>
        <br></br>
      </Form>
      {content &&
        content?.map((cont, index) => (
          <div className="col-sm-6 col-md-3 mb-3">
            {user ? (
              <>
                <Link to={"/" + cont._id} key={index}>
                  <img
                    src={`${cont.category}/${cont.path}`}
                    alt={cont.path}
                    className="img-fluid w-100 h-75"
                  />
                </Link>
                <br></br>
                <br></br>
                <button
                  onClick={() => toggleLike(cont._id)}
                  style={{
                    width: "60px",
                    height: "30px",
                    fontSize: "15px",
                    borderRadius: "10px",
                    backgroundColor: "#3366ff",
                  }}
                >
                  Like{cont.likeCount}
                </button>
              </>
            ) : (
              <img
                src={`${cont.category}/${cont.path}`}
                alt={cont.path}
                key={index}
                className="img-fluid w-100 h-75"
              />
            )}
          </div>
        ))}
    </div>
  );
};
export default BoardUser;
