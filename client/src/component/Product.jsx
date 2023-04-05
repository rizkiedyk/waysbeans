import { Button } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../config/api";
import Swal from "sweetalert2";
// import { useState } from "react";

const Products = (props) => {
  const navigate = useNavigate();
  // const { IsLogin, user } = props;
  // const [showLogin, setModalLogin] = useState(false);

  // Fetching product data from database
  let { data: products } = useQuery("productsCache", async () => {
    const response = await API.get("/products");
    return response.data.data;
  });

  const params = useParams();
  let Product = products.filter(
    (Product) => Product.id === parseInt(params.id)
  );
  Product = Product[0];

  const addCart = useMutation(async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const data = {
        order_quantity: +1,
      };

      const body = JSON.stringify(data);

      console.log(body);
      const response = await API.post(`/cart/${Product.id}`, body, config);
      console.log("transaction success :", response);

      navigate("/my-cart");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Add Success",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch {
      Swal.fire({
        position: "center",
        icon: "failed",
        title: "Failed Existing Product in Cart",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });

  return (
    <>
      <div
        className="container d-flex justify-content-center align-items-center mb-5"
        style={{ marginTop: 92, padding: "0 100px" }}
      >
        <div className="left-content">
          <div className="img-wrapper" style={{ width: 436, height: 555 }}>
            <img
              src={Product.photo}
              alt={Product.name}
              style={{ width: "100%" }}
            />
          </div>
        </div>
        <div className="ms-5 right-content">
          <div className="right-wrapper">
            <h1 className="fw-bold" style={{ color: "#613D2B", marginTop: 0 }}>
              {Product.name}
            </h1>
            <p style={{ color: "#974A4A", fontSize: 18 }}>
              Stock: {Product.stock}
            </p>
            <p className="mt-5" style={{ textAlign: "justify", fontSize: 18 }}>
              {Product.description}
            </p>
            <p
              className="my-4 text-end"
              style={{ color: "#974A4A", fontWeight: 900, fontSize: 24 }}
            >
              Rp. {Product.price}
            </p>
          </div>
          <Button
            type="submit"
            onClick={() => addCart.mutate()}
            className="rounded-3 fw-bold border-0 py-2 w-100 mt-3 text-white"
            style={{ backgroundColor: "#613D2B" }}
          >
            Add Cart
          </Button>
        </div>
      </div>
    </>
  );
};

export default Products;
