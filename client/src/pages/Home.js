import { Helmet } from "react-helmet";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper";
import { Col, Row } from "reactstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { addCartHandle } from "utils";
import { currencyFormatter } from "utils/currencyFormat";
import { useSelector } from "react-redux";

const Home = () => {
  const token = useSelector((state) => state.auth?.user?.token);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [mostSelledProducts, setMostSelledProducts] = useState([]);
  const [mostSelledCategories, setMostSelledCategories] = useState([]);

  useEffect(() => {
    getMostSelledProducts();
    getMostSelledCategories();
  }, []);

  useEffect(() => {
    if (token) {
      getRecommendedProducts();
    } else {
      setRecommendedProducts([]);
    }
  }, [token]);

  const getRecommendedProducts = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/recommendation`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRecommendedProducts(res.data);
      });
  };

  const getMostSelledProducts = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/most-selled-products`).then((res) => {
      setMostSelledProducts(res.data);
    });
  };

  const getMostSelledCategories = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/most-selled-categories`).then((res) => {
      setMostSelledCategories(res.data);
    });
  };

  return (
    <>
      <Helmet>
        <title>Anasayfa</title>
      </Helmet>
      <div>
        <section className="hero-area">
          <div className="container">
            <Row>
              <Col xs="12" lg="8" className="ustom-padding-right">
                <div className="slider-head">
                  <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                      delay: 10000,
                      disableOnInteraction: false,
                    }}
                    loop={true}
                    effect={"fade"}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, EffectFade, Pagination, Navigation]}
                    className="hero-slider"
                  >
                    <SwiperSlide className="single-slider" style={{ backgroundImage: "url(/images/hero/slider-bg1.jpg)" }}>
                      <div className="content">
                        <h2>
                          <span>İndirim</span>
                          M75 Spor Saat
                        </h2>
                        <h3>
                          3200.00 ₺ <span>ile başlayan fiyatlarla</span>
                        </h3>
                        <div className="button">
                          <a href="product-grids.html" className="btn">
                            Şimdi İncele
                          </a>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide className="single-slider" style={{ backgroundImage: "url(/images/hero/slider-bg2.jpg)" }}>
                      <div className="content">
                        <h2>
                          <span>İndirim</span>
                          Güvenlik Kamerasında en iyi fiyat indirimini yakalayın
                        </h2>
                        <h3>
                          5900.00 ₺ <span>ile başlayan fiyatlarla</span>
                        </h3>
                        <div className="button">
                          <a href="product-grids.html" className="btn">
                            Şimdi İncele
                          </a>
                        </div>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </Col>
              <div className="col-lg-4 col-12">
                <Row>
                  <Col xs="12" md="6" lg="12" className="md-custom-padding">
                    {/* Start Small Banner */}
                    <div className="hero-small-banner" style={{ backgroundImage: "url(/images/hero/slider-bnr.jpg)" }}>
                      <div className="content">
                        <h2>
                          {/* <span>Yeni hat gerekli</span> */}
                          iPhone 12 Pro Max
                        </h2>
                        <h3>25.000 ₺</h3>
                      </div>
                    </div>
                    {/* End Small Banner */}
                  </Col>
                  <div className="col-lg-12 col-md-6 col-12">
                    {/* Start Small Banner */}
                    <div className="hero-small-banner style2">
                      <div className="content">
                        <h2>Haftalık İndirim!</h2>
                        <p>Bu hafta tüm online mağaza ürünlerinde %50'ye varan indirim.</p>
                        <div className="button">
                          <a className="btn" href="product-grids.html">
                            Şimdi İncele
                          </a>
                        </div>
                      </div>
                    </div>
                    {/* Start Small Banner */}
                  </div>
                </Row>
              </div>
            </Row>
          </div>
        </section>

        {recommendedProducts.length > 0 && (
          <section className="trending-product section" style={{ marginTop: "12px" }}>
            <div className="container">
              <Row>
                <Col xs="12">
                  <div className="section-title">
                    <h2>Önerilen Ürünler</h2>
                  </div>
                </Col>
              </Row>
              <Row className="mt-3 gy-3">
                <Swiper
                  slidesPerView={4}
                  spaceBetween={30}
                  navigation={true}
                  rewind={true}
                  modules={[Navigation]}
                  className="recommended-product-slide pb-5"
                >
                  {recommendedProducts?.map((product) => (
                    <SwiperSlide key={product.Id}>
                      <div className="single-product d-flex flex-column justify-content-between">
                        <div className="product-image">
                          <img
                            src={product.ImageUrl ? `${process.env.REACT_APP_BASE_URL}/${product.ImageUrl}` : process.env.REACT_APP_DEFAULT_IMAGE}
                            alt={product.Name}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src = process.env.REACT_APP_DEFAULT_IMAGE;
                            }}
                          />
                          <div className="button">
                            <button onClick={() => addCartHandle(product.Id)} className="btn" type="button">
                              <i className="lni lni-cart" /> Sepete Ekle
                            </button>
                          </div>
                        </div>
                        <div className="product-info">
                          <span className="category">{product.CategoryName}</span>
                          <h4 className="title">
                            <Link to={`/${product.Id}`}>{product.Name}</Link>
                          </h4>
                          <ul className="review">
                            {[...Array(5).keys()].map((star, index) => (
                              <li key={index}>
                                <i className={`lni lni-star${product?.Rating > star ? "-filled" : ""}`} />
                              </li>
                            ))}
                            <li>
                              <span>{product?.RatingCount} Değerlendirme</span>
                            </li>
                          </ul>
                          <div className="price">
                            <span>{currencyFormatter.format(product.Price)}</span>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Row>
            </div>
          </section>
        )}

        {mostSelledProducts.length > 0 && (
          <section className="trending-product section" style={{ marginTop: "12px" }}>
            <div className="container">
              <Row>
                <Col xs="12">
                  <div className="section-title">
                    <h2>En Çok Satılan Ürünler</h2>
                  </div>
                </Col>
              </Row>
              <Row className="mt-3 gy-3">
                <Swiper
                  slidesPerView={4}
                  spaceBetween={30}
                  navigation={true}
                  rewind={true}
                  modules={[Navigation]}
                  className="recommended-product-slide pb-5"
                >
                  {mostSelledProducts?.map((product) => (
                    <SwiperSlide key={product.Id}>
                      <div className="single-product d-flex flex-column justify-content-between">
                        <div className="product-image">
                          <img
                            src={product.ImageUrl ? `${process.env.REACT_APP_BASE_URL}/${product.ImageUrl}` : process.env.REACT_APP_DEFAULT_IMAGE}
                            alt={product.Name}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src = process.env.REACT_APP_DEFAULT_IMAGE;
                            }}
                          />
                          <div className="button">
                            <button onClick={() => addCartHandle(product.Id)} className="btn" type="button">
                              <i className="lni lni-cart" /> Sepete Ekle
                            </button>
                          </div>
                        </div>
                        <div className="product-info">
                          <span className="category">{product.CategoryName}</span>
                          <h4 className="title">
                            <Link to={`/${product.Id}`}>{product.Name}</Link>
                          </h4>
                          <ul className="review">
                            {[...Array(5).keys()].map((star, index) => (
                              <li key={index}>
                                <i className={`lni lni-star${product?.Rating > star ? "-filled" : ""}`} />
                              </li>
                            ))}
                            <li>
                              <span>{product?.RatingCount} Değerlendirme</span>
                            </li>
                          </ul>
                          <div className="price">
                            <span>{currencyFormatter.format(product.Price)}</span>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Row>
            </div>
          </section>
        )}

        {mostSelledCategories.length > 0 && (
          <section className="featured-categories section">
            <div className="container">
              <Row>
                <Col xs="12">
                  <div className="section-title">
                    <h2>Öne Çıkan Kategoriler</h2>
                  </div>
                </Col>
                {mostSelledCategories.map((category) => (
                  <Col xs="12" md="6" lg="4" key={category.id}>
                    <Link to={`${category.url}-kategorisi`} className="single-category d-flex align-items-center justify-content-between">
                      <h3 className="heading">{category.name}</h3>
                      <img
                        src={`${process.env.REACT_APP_BASE_URL}/${category.imageUrl}`}
                        alt="#"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = process.env.REACT_APP_DEFAULT_IMAGE;
                        }}
                      />
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Home;
