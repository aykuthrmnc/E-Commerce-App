import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { currencyFormatter, dateFormatter } from "utils/currencyFormat";
import { addCartHandle } from "utils";
import { Col, Row } from "reactstrap";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct, fetchProductRatings } from "utils/fetchers";
import Page404 from "pages/Page404";
import Pagination from "components/Pagination/Pagination";
import Loader from "components/Loaders/Loader";
import { Helmet } from "react-helmet";

const Product = () => {
  const [quantity, setQuantity] = useState(1);
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNo = +searchParams.get("pageNo") || 1;
  const page = +searchParams.get("pageSize") || 10;
  const pageSize = page > 50 ? 10 : page < 1 ? 10 : page;
  const { data: product, isLoading, isError } = useQuery(["product", params?.id], () => fetchProduct(params?.id), { enabled: params.id != null });
  const productRatings = useQuery(["productRatings", params?.id, { pageNo, pageSize }], () => fetchProductRatings(params?.id, pageNo, pageSize), {
    enabled: params.id != null,
  });

  const [currentImage, setCurrentImage] = useState({ id: "", imageUrl: "" });

  useEffect(() => {
    if (product?.productImages.length > 0) {
      setCurrentImage({
        id: product.productImages[0].id,
        imageUrl: `${process.env.REACT_APP_BASE_URL}/${product.productImages[0].imageUrl}`,
      });
    }
  }, [product]);

  if (isLoading) {
    return <Loader />;
  }

  if (params.id == null || isError) {
    return <Page404 />;
  }

  return (
    <>
      <Helmet>
        <title>{product?.name || "AykutHrmnc"}</title>
      </Helmet>
      <section className="item-details section">
        <div className="container">
          <div className="top-area">
            <Row className="align-items-center">
              <Col xs="12" md="12" lg="6">
                <div className="product-images">
                  <main id="gallery">
                    <div className="main-img">
                      <img
                        src={currentImage?.imageUrl ? currentImage?.imageUrl : process.env.REACT_APP_DEFAULT_IMAGE}
                        id="current"
                        alt={product?.name}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = process.env.REACT_APP_DEFAULT_IMAGE;
                        }}
                      />
                    </div>
                    <div className="images align-items-center">
                      {product?.productImages?.length > 1 &&
                        product.productImages
                          // ?.slice(-5) metodu ile son 5 urun resmi gosterilir.
                          .map((image) => (
                            <img
                              onClick={() => setCurrentImage({ id: image.id, imageUrl: `${process.env.REACT_APP_BASE_URL}/${image.imageUrl}` })}
                              key={image.id}
                              src={image.imageUrl ? `${process.env.REACT_APP_BASE_URL}/${image.imageUrl}` : process.env.REACT_APP_DEFAULT_IMAGE}
                              className="img"
                              style={{ opacity: image.id === currentImage.id && 0.6 }}
                              alt={product?.name}
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = process.env.REACT_APP_DEFAULT_IMAGE;
                              }}
                            />
                          ))}
                    </div>
                  </main>
                </div>
              </Col>
              <div className="col-lg-6 col-md-12 col-12">
                <div className="product-info">
                  <h2 className="title">{product?.name}</h2>
                  <p className="category">
                    <i className="lni lni-tag" /> Kategori:
                    <Link to={`/${product?.categoryUrl}-kategorisi`}>{product?.categoryName}</Link>
                  </p>
                  <h3 className="price">{currencyFormatter.format(product?.price || 0)}</h3>
                  <p className="info-text">{product?.description}</p>
                  <Row>
                    <Col xs="12" md="4" lg="4">
                      <div className="form-group quantity">
                        <label htmlFor="color">Adet</label>
                        <select value={quantity} onChange={(e) => setQuantity(e.target.value)} className="form-control">
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                    </Col>
                  </Row>
                  <div className="bottom-content">
                    <Row className="align-items-end">
                      <Col xs="12" md="4" lg="4">
                        <div className="button cart-button">
                          <button onClick={() => addCartHandle(product?.id, quantity)} className="btn" style={{ width: "100%" }}>
                            Sepete Ekle
                          </button>
                        </div>
                      </Col>
                      {/* <div className="col-lg-4 col-md-4 col-12">
                        <div className="wish-button">
                          <button className="btn">
                            <i className="lni lni-reload" /> Karşılaştır
                          </button>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-12">
                        <div className="wish-button">
                          <button className="btn">
                            <i className="lni lni-heart" /> Favorilere Ekle
                          </button>
                        </div>
                      </div> */}
                    </Row>
                  </div>
                </div>
              </div>
            </Row>
          </div>
          <div className="product-details-info">
            {/* <div className="single-block">
              <div className="row">
                <div className="col-lg-6 col-12">
                  <div className="info-body custom-responsive-margin">
                    <h4>Details</h4>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                      enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                      in reprehenderit in voluptate velit esse cillum dolore eu fugiat.
                    </p>
                    <h4>Features</h4>
                    <ul className="features">
                      <li>Capture 4K30 Video and 12MP Photos</li>
                      <li>Game-Style Controller with Touchscreen</li>
                      <li>View Live Camera Feed</li>
                      <li>Full Control of HERO6 Black</li>
                      <li>Use App for Dedicated Camera Operation</li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-6 col-12">
                  <div className="info-body">
                    <h4>Specifications</h4>
                    <ul className="normal-list">
                      <li>
                        <span>Weight:</span> 35.5oz (1006g)
                      </li>
                      <li>
                        <span>Maximum Speed:</span> 35 mph (15 m/s)
                      </li>
                      <li>
                        <span>Maximum Distance:</span> Up to 9,840ft (3,000m)
                      </li>
                      <li>
                        <span>Operating Frequency:</span> 2.4GHz
                      </li>
                      <li>
                        <span>Manufacturer:</span> GoPro, USA
                      </li>
                    </ul>
                    <h4>Shipping Options:</h4>
                    <ul className="normal-list">
                      <li>
                        <span>Courier:</span> 2 - 4 days, $22.50
                      </li>
                      <li>
                        <span>Local Shipping:</span> up to one week, $10.00
                      </li>
                      <li>
                        <span>UPS Ground Shipping:</span> 4 - 6 days, $18.00
                      </li>
                      <li>
                        <span>Unishop Global Export:</span> 3 - 4 days, $25.00
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="row">
              <div className="col-lg-4 col-12">
                <div className="single-block give-review">
                  <h4>Değerlendirme Puanı - {product?.productTotalRating.totalRating}</h4>
                  <ul>
                    <li>
                      <span>5 yıldız - {product?.productTotalRating.fiveStar}</span>
                      <i className="lni lni-star-filled" />
                      <i className="lni lni-star-filled" />
                      <i className="lni lni-star-filled" />
                      <i className="lni lni-star-filled" />
                      <i className="lni lni-star-filled" />
                    </li>
                    <li>
                      <span>4 yıldız - {product?.productTotalRating.fourStar}</span>
                      <i className="lni lni-star-filled" />
                      <i className="lni lni-star-filled" />
                      <i className="lni lni-star-filled" />
                      <i className="lni lni-star-filled" />
                      <i className="lni lni-star" />
                    </li>
                    <li>
                      <span>3 yıldız - {product?.productTotalRating.threeStar}</span>
                      <i className="lni lni-star-filled" />
                      <i className="lni lni-star-filled" />
                      <i className="lni lni-star-filled" />
                      <i className="lni lni-star" />
                      <i className="lni lni-star" />
                    </li>
                    <li>
                      <span>2 yıldız - {product?.productTotalRating.twoStar}</span>
                      <i className="lni lni-star-filled" />
                      <i className="lni lni-star-filled" />
                      <i className="lni lni-star" />
                      <i className="lni lni-star" />
                      <i className="lni lni-star" />
                    </li>
                    <li>
                      <span>1 yıldız - {product?.productTotalRating.oneStar}</span>
                      <i className="lni lni-star-filled" />
                      <i className="lni lni-star" />
                      <i className="lni lni-star" />
                      <i className="lni lni-star" />
                      <i className="lni lni-star" />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-8 col-12">
                <div className="single-block">
                  <div className="reviews">
                    <h4 className="title">Son Değerlendirmeler</h4>
                    {productRatings.data?.productRatings?.map((productRating, index) => (
                      <div className="single-review ps-0" key={index}>
                        {/* <img
                          src="/images/blog/comment1.jpg"
                          alt="#"
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = process.env.REACT_APP_DEFAULT_IMAGE;
                          }}
                        /> */}
                        <div className="review-info">
                          <h4>
                            {productRating.firstName} {productRating.lastName}
                            <span>{dateFormatter(productRating.ratingDate)}</span>
                          </h4>
                          <ul className="stars">
                            {[...Array(5).keys()].map((star, index) => (
                              <li key={index}>
                                <i className={`lni lni-star${productRating.rating > star ? "-filled" : ""}`} />
                              </li>
                            ))}
                          </ul>
                          <p>{productRating.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Pagination
                  totalPages={productRatings.data?.totalPages}
                  currentPage={productRatings.data?.pageNo}
                  changePage={(selectedPage) => setSearchParams({ pageNo: selectedPage, pageSize })}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Product;
