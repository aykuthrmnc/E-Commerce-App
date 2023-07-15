import { Link, useSearchParams } from "react-router-dom";
import { currencyFormatter } from "utils/currencyFormat";
import { useQuery } from "@tanstack/react-query";
import { fetchSearch } from "utils/fetchers";
import { addCartHandle } from "utils";
import { Col, Container, Row } from "reactstrap";
import Pagination from "components/Pagination/Pagination";
import { Helmet } from "react-helmet";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const pageNo = +searchParams.get("pageNo") || 1;
  const page = +searchParams.get("pageSize") || 12;
  const pageSize = page > 50 ? 12 : page < 1 ? 12 : page;

  const { data: products } = useQuery(["search", { search, pageNo, pageSize }], () => fetchSearch(search, pageNo, pageSize));
  const categories = products?.categories;

  return (
    <>
      <Helmet>
        <title>Arama</title>
      </Helmet>
      <section className="product-grids section">
        <Container>
          <Row>
            <Col xs="12" lg="3">
              <div className="product-sidebar">
                <div className="single-widget">
                  <h3>Tüm Kategoriler</h3>
                  <ul className="list">
                    {categories?.map((category) => (
                      <li key={category.id}>
                        <a href={`${category.url}-kategorisi`}>{category.name}</a>
                        {/* <span>(1138)</span> */}
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
                          onChange={(e) => setSearchParams({ search, pageNo: 1, pageSize: e.target.value })}
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
                        <Col xs="12" md="12" lg="12" key={product.id} className="col-lg-12 col-md-12 col-12">
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
                  <Pagination
                    totalPages={products?.totalPages}
                    currentPage={products?.pageNo}
                    changePage={(selectedPage) => setSearchParams({ search, pageNo: selectedPage, pageSize })}
                    pageTopLinks
                    pageLinks
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Search;
