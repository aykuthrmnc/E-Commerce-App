import CounterButton from "components/CounterButton";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { removeCartHandle } from "utils";
import { currencyFormatter } from "utils/currencyFormat";

const Cart = () => {
  const carts = useSelector((state) => state.cart.carts);

  return (
    <>
      <Helmet>
        <title>Sepet</title>
      </Helmet>
      <div className="shopping-cart section">
        <div className="container">
          <div className="cart-list-head">
            <div className="cart-list-title">
              <div className="row">
                <div className="col-lg-1 col-md-1 col-12" />
                <div className="col-lg-4 col-md-3 col-12">
                  <p>Ürün İsmi</p>
                </div>
                <div className="col-lg-2 col-md-2 col-12">
                  <p>Adet</p>
                </div>
                <div className="col-lg-2 col-md-2 col-12">
                  <p>Ara toplam</p>
                </div>
                <div className="col-lg-2 col-md-2 col-12">
                  <p>İndirim</p>
                </div>
                <div className="col-lg-1 col-md-2 col-12">
                  <p>Sil</p>
                </div>
              </div>
            </div>
            {carts?.length ? (
              carts?.map((cart) => (
                <div key={cart.id} className="cart-single-list">
                  <div className="row align-items-center">
                    <div className="col-lg-1 col-md-1 col-12">
                      <Link to={`/${cart.productId}`}>
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
                    <div className="col-lg-4 col-md-3 col-12">
                      <h5 className="product-name">
                        <Link to={`/${cart.productId}`}> {cart.name}</Link>
                      </h5>
                    </div>
                    <div className="col-lg-2 col-md-2 col-12">
                      <div className="count-input">
                        <CounterButton cart={cart} />
                        {/* <select className="form-control">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select> */}
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2 col-12">
                      <p>{currencyFormatter.format(cart.price * cart.quantity)}</p>
                    </div>
                    <div className="col-lg-2 col-md-2 col-12">
                      <p>{cart.discount ? currencyFormatter.format(cart.discount) : "-"}</p>
                    </div>
                    <div className="col-lg-1 col-md-2 col-12">
                      <Button onClick={() => removeCartHandle(cart.id)} className="remove-item border-0 p-0">
                        <i className="lni lni-close" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="cart-single-list text-center">Sepetinizde ürün bulunmamaktadır.</div>
            )}
          </div>
          <div className="row">
            <div className="col-12">
              <div className="total-amount">
                <div className="row">
                  <div className="col-lg-8 col-md-6 col-12">
                    {/* <div className="left">
                      <div className="coupon">
                        <form action="#" target="_blank">
                          <input name="Coupon" placeholder="Kuponu girin" />
                          <div className="button">
                            <button className="btn">Kupon Uygula</button>
                          </div>
                        </form>
                      </div>
                    </div> */}
                  </div>
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="right">
                      <ul>
                        <li className="d-flex justify-content-between">
                          Ürün Toplam Fiyatı<span>{currencyFormatter.format(carts?.reduce((i, j) => i + j.price * j.quantity, 0))}</span>
                        </li>
                        <li className="d-flex justify-content-between">
                          Kargo<span>Ücretsiz</span>
                        </li>
                        <li className="d-flex justify-content-between">
                          İndirim<span>{currencyFormatter.format(carts?.reduce((i, j) => i + j.discount, 0))}</span>
                        </li>
                        <li className="last d-flex justify-content-between">
                          Toplam<span>{currencyFormatter.format(carts?.reduce((i, j) => i + (j.price + j.discount / 100) * j.quantity, 0))}</span>
                        </li>
                      </ul>
                      <div className="button">
                        <Link to="/profile/checkout" className="btn">
                          Ödeme Yap
                        </Link>
                        <Link to="/" className="btn btn-alt">
                          Alışverişe devam et
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
