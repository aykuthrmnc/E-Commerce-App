import axios from "utils/axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import { toast } from "react-toastify";
import Pagination from "components/Pagination/Pagination";
import { Helmet } from "react-helmet";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNo = +searchParams.get("pageNo") || 1;
  const page = +searchParams.get("pageSize") || 10;
  const pageSize = page > 50 ? 10 : page < 1 ? 10 : page;

  // useEffect(() => {
  //   // Sayfa basinda parametreleri atamak icin
  //   setSearchParams({ pageNo, pageSize });
  // }, []);

  useEffect(() => {
    getProductHandle();
  }, [pageNo, pageSize]);

  const getProductHandle = () => {
    axios.get(`/products?pageNo=${pageNo}&pageSize=${pageSize}`).then((res) => {
      setProducts(res.data);
    });
  };

  //   let allCategories = [];
  //   useEffect(() => {
  //     joinCategories(categories);
  //   }, [categories]);
  //   const joinCategories = (categories) => {
  //     categories.forEach((category) => {
  //       if (category?.subCategories?.length > 0) {
  //         joinCategories(category?.subCategories);
  //       }
  //       allCategories.push({
  //         id: category.id,
  //         name: category.name,
  //         url: category.url,
  //         description: category.description,
  //         mainCategoryId: category.mainCategoryId,
  //       });
  //     });
  //   };

  const removeProductHandle = (product) => {
    axios
      .delete(`/products/${product.id}`)
      .then(() => {
        toast.success("Ürün başarıyla silindi.");
        getProductHandle();
      })
      .catch(() => {
        toast.error("Ürün silinemedi.");
      });
  };

  return (
    <>
      <Helmet>
        <title>Admin • Ürünler</title>
      </Helmet>
      <Container>
        <div className="d-flex justify-content-center justify-content-md-end mb-3 gap-3">
          <Button color="primary" tag={Link} to={`/admin/product`}>
            Ürün Ekle
          </Button>
          <Button color="primary" tag={Link} to={`/admin/productimages`}>
            Ürün Resmi Ekle
          </Button>
        </div>
        <div className="cart-list-head">
          <div className="cart-list-title">
            <div className="row">
              <Col xs="12" md="2" lg="1">
                <p>Ürün Resmi</p>
              </Col>
              <Col xs="12" md="2" lg="4">
                <p>Ürün İsmi</p>
              </Col>
              <Col xs="12" md="2" lg="2">
                <p>Ürün Açıklaması</p>
              </Col>
              <Col xs="12" md="2" lg="2">
                <p>Ürün Fiyatı</p>
              </Col>
              <Col xs="12" md="2" lg="2" className="text-center">
                <p>Düzenle</p>
              </Col>
              <Col xs="12" md="2" lg="1" className="text-center">
                <p>Sil</p>
              </Col>
            </div>
          </div>
          {products?.products?.length ? (
            products?.products?.map((product) => (
              <div key={product.id} className="cart-single-list">
                <Row className="align-items-center">
                  <Col xs="12" md="2" lg="1" className="text-center">
                    <img
                      src={product.imageUrl ? `${process.env.REACT_APP_BASE_URL}/${product.imageUrl}` : process.env.REACT_APP_DEFAULT_IMAGE}
                      alt={product.name}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = process.env.REACT_APP_DEFAULT_IMAGE;
                      }}
                    />
                  </Col>
                  <Col xs="12" md="2" lg="4">
                    {product.name}
                  </Col>
                  <Col xs="12" md="2" lg="2" className="text-truncate">
                    {product.description}
                  </Col>
                  <Col xs="12" md="2" lg="2">
                    {product.price}
                  </Col>
                  <Col xs="12" md="2" lg="2" className="text-center">
                    <Button color="primary" tag={Link} to={`/admin/product/${product.id}`}>
                      Düzenle
                    </Button>
                  </Col>
                  <Col xs="12" md="2" lg="1" className="text-center">
                    <Button color="danger" onClick={() => removeProductHandle(product)}>
                      Sil
                    </Button>
                  </Col>
                </Row>
              </div>
            ))
          ) : (
            <div className="cart-single-list text-center">Ürün çeşidi bulunmamaktadır.</div>
          )}
        </div>
        <Pagination
          totalPages={products?.totalPages}
          currentPage={products?.pageNo}
          changePage={(selectedPage) => setSearchParams({ pageNo: selectedPage, pageSize })}
          pageTopLinks
          pageLinks
        />
      </Container>
    </>
  );
};

export default ProductList;
