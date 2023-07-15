import React from "react";
import { Link } from "react-router-dom";
import { Button, Container } from "reactstrap";

const Mail = () => {
  return (
    <div className="maill-success">
      <div className="d-table">
        <div className="d-table-cell">
          <Container>
            <div className="success-content">
              <i className="lni lni-envelope"></i>
              <h2>E-postanız Başarıyla Gönderildi</h2>
              <p>Bizimle iletişime geçtiğiniz için teşekkür ederiz, en kısa sürede size geri döneceğiz.</p>
              <Button tag={Link} to="/" color="primary">
                Anasayfaya dön
              </Button>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Mail;
