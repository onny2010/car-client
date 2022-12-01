import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams,useHistory } from "react-router";
import Appbar from "../Shared/Appbar/Appbar";
import Footer from "../Shared/Footer/Footer";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import "./Booking.css";
const Booking = () => {
  const { user,setOrderData,product, setProduct } = useAuth();
  
  const { id } = useParams();
  const history = useHistory()
  useEffect(() => {
    fetch(`${process.env.REACT_APP_MECHANIC}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        console.log(data);
      });
  }, [id,setProduct]);
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    if (!data.name) {
      data.name = user.displayName;
    }
    if (!data.email) {
      data.email = user.email;
    }
    const productName = product.name;
    const productPrice = product.price;
    const status = "Pending";
    const submittedData = { ...data, productName, productPrice, status };
      setOrderData(submittedData)
      history.push("/payment")
  };

  const { name, img, price, description } = product;
  return (
    <div>
      <Appbar></Appbar>
      <Container className="booking-sections">
        <Row>
          <Col lg={6} sm={12}>
            <h1 className="text-center fw-bold my-5">Please Fill the form</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                className="form-control mb-3"
                defaultValue={user.displayName}
                {...register("name")}
                disabled
              />
              <input
                className="form-control mb-3"
                defaultValue={user.email}
                {...register("email")}
                disabled
              />
              <input
                className="form-control mb-3"
                placeholder="Your Address"
                {...register("address", { required: true })}
              />
              <input
                className="form-control mb-3"
                placeholder="Your Phone"
                type="number"
                {...register("phone", { required: true })}
              />
              <input type="submit" />
            </form>
          </Col>
          <Col lg={6} sm={12}>
            <img className="product-details-image" src={img} alt="" />
            <h3 className="product-name">Product Name: {name}</h3>
            <h4 className="price">Price: ${price}</h4>
            <p>{description}</p>
          </Col>
        </Row>
      </Container>
      <Footer></Footer>
    </div>
  );
};

export default Booking;
