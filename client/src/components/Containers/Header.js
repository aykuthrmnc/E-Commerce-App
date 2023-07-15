/* eslint-disable jsx-a11y/anchor-is-valid */
import { useSelector } from "react-redux";
import { Link, NavLink as RRNavLink } from "react-router-dom";
import { Col, Container, NavLink, Row } from "reactstrap";
import { getCartHandle, getCategoriesHandle, removeCartHandle, userLogoutHandle } from "utils";
import { useState } from "react";
import { useEffect } from "react";
import { currencyFormatter } from "utils/currencyFormat";
import { FaOpencart } from "react-icons/fa";

const Header = () => {
  const [search, setSearch] = useState("");
  const user = useSelector((state) => state.auth.user);
  const categories = useSelector((state) => state.product.categories);
  const carts = useSelector((state) => state.cart.carts);

  const cartQuantity = carts?.reduce((i, j) => i + j.quantity, 0) | 0;

  useEffect(() => {
    getCategoriesHandle();
    if (user) {
      getCartHandle();
    }
  }, [user]);

  return (
    <>
      <header className="header navbar-area">
        <div className="topbar">
          <Container>
            <Row className="align-items-center">
              <Col xs={12} md={4} lg={4}>
                <div className="top-left">
                  {/* <ul className="menu-top-link">
                    <li>
                      <div className="select-position">
                        <select defaultValue={0} id="select4">
                          <option value={0}>₺ TL</option>
                          <option value={1}>$ USD</option>
                          <option value={2}>€ EURO</option>
                          <option value={3}>$ CAD</option>
                          <option value={4}>₹ INR</option>
                          <option value={5}>¥ CNY</option>
                          <option value={6}>৳ BDT</option>
                        </select>
                      </div>
                    </li>
                    <li>
                      <div className="select-position">
                        <select defaultValue={0} id="select5">
                          <option value={0}>Türkçe</option>
                          <option value={1}>English</option>
                          <option value={2}>Español</option>
                          <option value={3}>Filipino</option>
                          <option value={4}>Français</option>
                          <option value={5}>العربية</option>
                          <option value={6}>हिन्दी</option>
                          <option value={7}>বাংলা</option>
                        </select>
                      </div>
                    </li>
                  </ul> */}
                </div>
              </Col>
              <Col xs={12} md={4} lg={4}>
                {/* <div className="top-middle">
                  <ul className="useful-links">
                    <li>
                      <Link to="/">Anasayfa</Link>
                    </li>
                    <li>
                      <Link to="/">Hakkımızda</Link>
                    </li>
                    <li>
                      <Link to="/">İletişim</Link>
                    </li>
                  </ul>
                </div> */}
              </Col>
              <Col xs={12} md={4} lg={4} className="text-end">
                <div className="top-end">
                  <div className="user">
                    <i className="lni lni-user" />
                    {user ? (
                      <Link to="/profile" className="user-profile">
                        {user.firstName} {user.lastName}
                      </Link>
                    ) : (
                      "Misafir"
                    )}
                  </div>
                  <ul className="user-login">
                    {user ? (
                      <li>
                        <a type="button" onClick={() => userLogoutHandle()}>
                          Çıkış yap
                        </a>
                      </li>
                    ) : (
                      <>
                        <li>
                          <Link to="/auth/login">Giriş yap</Link>
                        </li>
                        <li>
                          <Link to="/auth/register">Kaydol</Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="header-middle">
          <Container>
            <Row className="align-items-center">
              <Col xs={7} sm={3} lg={4}>
                <Link to="/" className="d-inline-flex flex-column align-items-center justify-content-center">
                  {/* <FaDragon className="text-purple-400 text-center w-100" size={64} /> */}
                  <FaOpencart className="text-center w-100" size={64} />
                </Link>
              </Col>
              <Col md={7} lg={4} className="d-xs-none">
                <div className="main-menu-search">
                  <div className="navbar-search search-style-5">
                    <div className="search-input">
                      <input value={search} onInput={(e) => setSearch(e.target.value)} type="text" placeholder="Ara" />
                    </div>
                    <div className="search-btn">
                      <Link to={`/search?search=${search}`}>
                        <i className="lni lni-search-alt" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={5} md={2} lg={4}>
                <div className="middle-right-area">
                  <div className="navbar-cart ms-auto">
                    <div className="wishlist">
                      <Link to="/">
                        <i className="lni lni-heart" />
                        <span className="total-items">0</span>
                      </Link>
                    </div>
                    <div className="cart-items">
                      <Link to="/profile/cart" className="main-btn">
                        <i className="lni lni-cart" />
                        <span className="total-items">{cartQuantity}</span>
                      </Link>
                      <div className="shopping-item">
                        <div className="dropdown-cart-header">
                          <span>{cartQuantity} Ürün</span>
                          <Link to="/profile/cart">Sepete Git</Link>
                        </div>
                        <ul className="shopping-list">
                          {carts?.map((cart) => (
                            <li key={cart.id}>
                              <button onClick={() => removeCartHandle(cart.id)} className="remove" title="Remove this item" type="button">
                                <i className="lni lni-close" />
                              </button>
                              <div className="cart-img-head">
                                <Link to={`/${cart.productId}`} className="cart-img">
                                  <img
                                    src={cart.imageUrl ? `${process.env.REACT_APP_BASE_URL}/${cart.imageUrl}` : process.env.REACT_APP_DEFAULT_IMAGE}
                                    alt="#"
                                    onError={({ currentTarget }) => {
                                      currentTarget.onerror = null; // prevents looping
                                      currentTarget.src = process.env.REACT_APP_DEFAULT_IMAGE;
                                    }}
                                  />
                                </Link>
                              </div>
                              <div className="content">
                                <h4>
                                  <Link to={`/${cart.productId}`}>{cart.name}</Link>
                                </h4>
                                <p className="quantity">
                                  {cart.quantity} adet -{" "}
                                  <span className="amount">{currencyFormatter.format((cart.price + cart.discount / 100) * cart.quantity)}</span>
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className="bottom">
                          <div className="total">
                            <span>Toplam</span>
                            <span className="total-amount">
                              {carts
                                ? currencyFormatter.format(carts?.reduce((i, j) => i + (j.price + j.discount / 100) * j.quantity, 0))
                                : currencyFormatter.format(0)}
                            </span>
                          </div>
                          <div className="button">
                            <Link to="/profile/checkout" className="btn animate">
                              Sipariş Ver
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <Container>
          <Row className="align-items-center">
            <Col xs={12} md={6} lg={8}>
              <div className="nav-inner">
                <div className="mega-category-menu">
                  <span className="cat-button">
                    <i className="lni lni-menu" />
                    Tüm Kategoriler
                  </span>
                  <ul className="sub-category">
                    {categories?.map((category) => (
                      <li key={category.id}>
                        <Link to={`/${category.url}-kategorisi`}>
                          {category.name} {category?.subCategories.length > 0 && <i className="lni lni-chevron-right" />}
                        </Link>
                        {category?.subCategories.length > 0 && (
                          <ul className="inner-sub-category">
                            {category.subCategories.map((subCategory) => (
                              <li key={subCategory.id}>
                                <Link to={`/${subCategory.url}-kategorisi`}>{subCategory.name}</Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <nav className="navbar navbar-expand-lg">
                  <button
                    className="navbar-toggler mobile-menu-btn"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mobileMenu"
                    aria-expanded="false"
                  >
                    <span className="toggler-icon" />
                    <span className="toggler-icon" />
                    <span className="toggler-icon" />
                  </button>
                  <div className="collapse navbar-collapse sub-menu-bar" id="mobileMenu">
                    <ul id="nav" className="navbar-nav ms-auto">
                      <li className="nav-item">
                        <NavLink tag={RRNavLink} to="/" end>
                          Anasayfa
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink tag={RRNavLink} to="/profile/order">
                          Siparişler
                        </NavLink>
                      </li>
                      {user && (
                        <li className="nav-item">
                          <NavLink tag={RRNavLink} to="/profile/cart">
                            Sepet
                          </NavLink>
                        </li>
                      )}
                      {/* <li className="nav-item">
                        <NavLink type="button" aria-label="Toggle navigation">
                          İletişim
                        </NavLink>
                      </li> */}
                      {user.roleId === 1 && (
                        <li className="nav-item">
                          <NavLink
                            type="button"
                            className="dd-menu collapsed"
                            data-bs-toggle="collapse"
                            data-bs-target="#submenu-1-4"
                            aria-controls="navbarSupportedContent"
                          >
                            Admin
                          </NavLink>
                          <ul className="sub-menu collapse" id="submenu-1-4">
                            <li className="nav-item">
                              <NavLink tag={RRNavLink} to="/admin/categories">
                                Kategoriler
                              </NavLink>
                            </li>
                            <li className="nav-item">
                              <NavLink tag={RRNavLink} to="/admin/products">
                                Ürünler
                              </NavLink>
                            </li>
                          </ul>
                        </li>
                      )}
                    </ul>
                  </div>{" "}
                </nav>
              </div>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <div className="nav-social">
                <h5 className="title">Bizi takip et:</h5>
                <ul>
                  <li>
                    <a href="https://www.facebook.com/aykuthrmnc">
                      <i className="lni lni-facebook-filled" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/aykuthrmnc">
                      <i className="lni lni-instagram" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.twitter.com/aykuthrmnc">
                      <i className="lni lni-twitter-original" />
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </header>
    </>
  );
};

export default Header;
