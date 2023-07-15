import axios from "utils/axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useParams, useSearchParams } from "react-router-dom";
import { currencyFormatter } from "utils/currencyFormat";
import { addCartHandle } from "utils";
import { Col, Container, Row } from "reactstrap";
import Pagination from "components/Pagination/Pagination";
import { Helmet } from "react-helmet";

const ProductList = () => {
  const categories = useSelector((state) => state.product.categories);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNo = +searchParams.get("pageNo") || 1;
  const page = +searchParams.get("pageSize") || 12;
  const pageSize = page > 50 ? 12 : page < 1 ? 12 : page;

  const params = useParams();
  const [products, setProducts] = useState({});

  useEffect(() => {
    const categoryToFetch = categories
      .flatMap((category) => [category, ...(category.subCategories || null)])
      .find((category) => category.url === params.url);
    if (categoryToFetch) {
      axios.get(`/products/category/${categoryToFetch.id}?pageNo=${pageNo}&pageSize=${pageSize}`).then((res) => {
        setProducts(res.data);
      });
    }
    // for (let category of categories) {
    //   for (let subCategory of category.subCategories) {
    //     if (subCategory.url === params.url) {
    //       axios.get(`/products/category/${subCategory.id}?pageNo=${pageNo}&pageSize=${pageSize}`).then((res) => {
    //         setProducts(res.data);
    //       });
    //       break;
    //     }
    //   }
    //   if (category.url === params.url) {
    //     axios.get(`/products/category/${category.id}?pageNo=${pageNo}&pageSize=${pageSize}`).then((res) => {
    //       setProducts(res.data);
    //     });
    //     break;
    //   }
    // }
  }, [categories, pageNo, pageSize, params]);

  return (
    <>
      <Helmet>
        <title>{products.products?.[0]?.categoryName || "AykutHrmnc"}</title>
      </Helmet>
      <section className="product-grids section">
        <Container>
          <Row>
            <Col xs="12" lg="3">
              <div className="product-sidebar">
                <div className="single-widget">
                  <h3>Tüm Kategoriler</h3>
                  <ul className="list">
                    {categories
                      ?.flatMap((category) => [category, ...(category.subCategories || null)])
                      .map((category) => (
                        <li key={category.id}>
                          <NavLink to={`/${category.url}-kategorisi`}>{category.name}</NavLink>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </Col>
            <Col xs="12" lg="9">
              <div className="product-grids-head">
                <div className="product-grid-topbar">
                  <Row className="align-items-center">
                    <Col xs="12" md="8" lg="10">
                      <div className="product-sorting">
                        <label htmlFor="sorting">Gösterilen:</label>
                        <select
                          defaultValue={pageSize}
                          onChange={(e) => setSearchParams({ pageNo: 1, pageSize: e.target.value })}
                          className="form-control"
                          id="sorting"
                        >
                          <option>12</option>
                          <option>24</option>
                          <option>48</option>
                        </select>
                      </div>
                    </Col>
                    {/* <Col xs="12" md="8" lg="5">
                      <div className="product-sorting">
                        <label htmlFor="sorting">Sıralama:</label>
                        <select className="form-control" id="sorting">
                          <option>Popülerlik</option>
                          <option>Artan fiyat</option>
                          <option>Azalan fiyat</option>
                          <option>Çok değerlendirilenler</option>
                          <option>A - Z sıralama</option>
                          <option>Z - A sıralama</option>
                        </select>
                        <h3 className="total-show-product">
                          Gösterilen: <span>1 - 9 ürün</span>
                        </h3>
                      </div>
                    </Col> */}

                    <Col xs="12" md="4" lg="2">
                      <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                          <button
                            className="nav-link active"
                            id="nav-grid-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-grid"
                            type="button"
                            role="tab"
                            aria-controls="nav-grid"
                            aria-selected="true"
                          >
                            <i className="lni lni-grid-alt" />
                          </button>
                          <button
                            className="nav-link"
                            id="nav-list-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-list"
                            type="button"
                            role="tab"
                            aria-controls="nav-list"
                            aria-selected="false"
                          >
                            <i className="lni lni-list" />
                          </button>
                        </div>
                      </nav>
                    </Col>
                  </Row>
                </div>
                <div className="tab-content" id="nav-tabContent">
                  <div className="tab-pane fade show active" id="nav-grid" role="tabpanel" aria-labelledby="nav-grid-tab">
                    <Row className="mt-3 gy-3">
                      {products?.products?.map((product) => (
                        <Col xs="12" md="6" lg="4" key={product.id}>
                          <div className="single-product d-flex flex-column justify-content-between">
                            <div className="product-image">
                              <img
                                src={product.imageUrl ? `${process.env.REACT_APP_BASE_URL}/${product.imageUrl}` : process.env.REACT_APP_DEFAULT_IMAGE}
                                alt={product.name}
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // prevents looping
                                  currentTarget.src = process.env.REACT_APP_DEFAULT_IMAGE;
                                }}
                              />
                              <div className="button">
                                <button onClick={() => addCartHandle(product.id)} className="btn" type="button">
                                  <i className="lni lni-cart" /> Sepete Ekle
                                </button>
                              </div>
                            </div>
                            <div className="product-info">
                              <span className="category">{product.categoryName}</span>
                              <h4 className="title">
                                <Link to={`/${product.id}`}>{product.name}</Link>
                              </h4>
                              <ul className="review">
                                <li>
                                  <i className="lni lni-star-filled" />
                                </li>
                                <li>
                                  <i className="lni lni-star-filled" />
                                </li>
                                <li>
                                  <i className="lni lni-star-filled" />
                                </li>
                                <li>
                                  <i className="lni lni-star-filled" />
                                </li>
                                <li>
                                  <i className="lni lni-star" />
                                </li>
                                <li>
                                  <span>4.0 Değerlendirme</span>
                                </li>
                              </ul>
                              <div className="price">
                                <span>{currencyFormatter.format(product.price)}</span>
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                  <div className="tab-pane fade" id="nav-list" role="tabpanel" aria-labelledby="nav-list-tab">
                    <Row className="mt-3 gy-3">
                      {products?.products?.map((product) => (
                        <Col xs="12" md="12" lg="12" key={product.id}>
                          <div className="single-product">
                            <Row className="align-items-center">
                              <Col xs="12" md="4" lg="4">
                                <div className="product-image">
                                  <img
                                    src={
                                      product.imageUrl ? `${process.env.REACT_APP_BASE_URL}/${product.imageUrl}` : process.env.REACT_APP_DEFAULT_IMAGE
                                    }
                                    alt={product.name}
                                    onError={({ currentTarget }) => {
                                      currentTarget.onerror = null; // prevents looping
                                      currentTarget.src = process.env.REACT_APP_DEFAULT_IMAGE;
                                    }}
                                  />
                                  <div className="button">
                                    <button onClick={() => addCartHandle(product.id)} className="btn" type="button">
                                      <i className="lni lni-cart" /> Sepete Ekle
                                    </button>
                                  </div>
                                </div>
                              </Col>
                              <Col xs="12" md="8" lg="8">
                                <div className="product-info">
                                  <span className="category">{product.categoryName}</span>
                                  <h4 className="title">
                                    <Link to={`/${product.id}`}>{product.name}</Link>
                                  </h4>
                                  <ul className="review">
                                    <li>
                                      <i className="lni lni-star-filled" />
                                    </li>
                                    <li>
                                      <i className="lni lni-star-filled" />
                                    </li>
                                    <li>
                                      <i className="lni lni-star-filled" />
                                    </li>
                                    <li>
                                      <i className="lni lni-star-filled" />
                                    </li>
                                    <li>
                                      <i className="lni lni-star" />
                                    </li>
                                    <li>
                                      <span>4.0 Değerlendirme</span>
                                    </li>
                                  </ul>
                                  <div className="price">
                                    <span>{currencyFormatter.format(product.price)}</span>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                  {/* <Pagination2 values={products} hidePrevButton={products?.pageNo === 1} hideNextButton={products?.pageNo >= products?.totalPages} /> */}
                  <Pagination
                    totalPages={products?.totalPages}
                    currentPage={products?.pageNo}
                    changePage={(selectedPage) => setSearchParams({ pageNo: selectedPage, pageSize })}
                    pageTopLinks
                    pageLinks
                  />

                  {/* <div className="pagination left">
                    <ul className="pagination-list">
                      <li>
                        <button onClick={() => 1 !== pageNo && setSearchParams({ pageNo: pageNo - 1, pageSize: products?.pageSize })} type="button">
                          <i className="lni lni-chevron-left" />
                        </button>
                      </li>
                      {Array.from({ length: products?.totalPages }, (value, index) => (
                        <li className={pageNo === index + 1 ? "active" : ""} key={index}>
                          <button onClick={() => setSearchParams({ pageNo: index + 1, pageSize: products?.pageSize })} type="button">
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() => products?.totalPages !== pageNo && setSearchParams({ pageNo: pageNo + 1, pageSize: products?.pageSize })}
                          type="button"
                        >
                          <i className="lni lni-chevron-right" />
                        </button>
                      </li>
                    </ul>
                  </div> */}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ProductList;
