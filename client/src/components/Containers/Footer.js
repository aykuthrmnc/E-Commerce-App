import React from "react";
import { FaOpencart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <Container>
          <div className="inner-content">
            <Row>
              <Col xs={12} className="text-center">
                <div className="footer-logo">
                  <Link to="/">
                    {/* <FaDragon className="text-blue-600 text-center w-100" size={64} /> */}
                    <FaOpencart className="text-center w-100" size={64} />
                  </Link>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      <div className="footer-middle">
        <Container>
          <div className="bottom-inner">
            <Row>
              <Col xs={12} md={6} lg={3}>
                <div className="single-footer f-contact">
                  <h3>Bize Ulaşın</h3>
                  <p className="phone">Telefon: (+90) 555 555 5555</p>
                  <ul>
                    <li>
                      <span>Pazartesi - Cuma: </span> 8.00 - 17.00
                    </li>
                    <li>
                      <span>Cumartesi: </span> 10.00 - 15.00
                    </li>
                  </ul>
                  <p className="mail">
                    <a href="mailto:aykuthrmnc@gmail.com">aykuthrmnc@gmail.com</a>
                  </p>
                </div>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <div className="single-footer our-app">
                  <h3>Mobil Uygulamalar</h3>
                  <ul className="app-btn">
                    <li>
                      <a href="/" className="w-75">
                        <i className="lni lni-apple" />
                        <span className="big-title">App Store</span>
                        <span className="small-title">'dan indir</span>
                      </a>
                    </li>
                    <li>
                      <a href="/" className="w-75">
                        <i className="lni lni-play-store" />
                        <span className="big-title">Google Play</span>
                        <span className="small-title">'dan indir</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <div className="single-footer f-link">
                  <h3>Bilgiler</h3>
                  <ul>
                    <li>
                      <Link to="/">Hakkımızda</Link>
                    </li>
                    <li>
                      <Link to="/">İletişim</Link>
                    </li>
                    <li>
                      <Link to="/">Profil</Link>
                    </li>
                    <li>
                      <Link to="/">Site Haritası</Link>
                    </li>
                    <li>
                      <Link to="/">Sıkça Sorulanlar</Link>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <div className="single-footer f-link">
                  <h3>Alışveriş</h3>
                  <ul>
                    <li>
                      <Link to="/">Bilgisayar</Link>
                    </li>
                    <li>
                      <Link to="/">Akıllı Telefon &amp; Tablet</Link>
                    </li>
                    <li>
                      <Link to="/">TV, Görüntü &amp; Ses</Link>
                    </li>
                    <li>
                      <Link to="/">Kamera &amp; Resim</Link>
                    </li>
                    <li>
                      <Link to="/">Kulaklık</Link>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
      <div className="footer-bottom">
        <Container>
          <div className="inner-content">
            <Row className="align-items-center">
              <Col xs={12} lg={4}>
                <div className="payment-gateway">
                  <span>Anlaşmalı Kartlar:</span>
                  <img
                    src={`${process.env.PUBLIC_URL}/images/footer/credit-cards-footer.png`}
                    alt="#"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = process.env.REACT_APP_DEFAULT_IMAGE;
                    }}
                  />
                </div>
              </Col>
              <Col xs={12} lg={4}>
                <div className="copyright">
                  <p>
                    <Link to="/">AykutHrmnc</Link>
                  </p>
                </div>
              </Col>
              <Col xs={12} lg={4}>
                <ul className="socila">
                  <li>
                    <span>Bizi takip edin:</span>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/aykuthrmnc" target="_blank" rel="noreferrer">
                      <i className="lni lni-facebook-filled" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/aykuthrmnc" target="_blank" rel="noreferrer">
                      <i className="lni lni-instagram" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.twitter.com/aykuthrmnc" target="_blank" rel="noreferrer">
                      <i className="lni lni-twitter-original" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.google.com/search?q=Aykut+Harmancı" target="_blank" rel="noreferrer">
                      <i className="lni lni-google" />
                    </a>
                  </li>
                </ul>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
