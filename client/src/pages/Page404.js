import React from "react";
import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <div className="error-area">
      <div className="d-table">
        <div className="d-table-cell">
          <div className="container">
            <div className="error-content">
              <h1>404</h1>
              <h2>Sayfa Bulunamadı!</h2>
              <p>Aradığınız sayfa mevcut değil. Taşınmış veya silinmiş olabilir.</p>
              <div className="button">
                <Link to="/">Anasayfaya dön</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page404;
