import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import { removeCategoryHandle } from "utils";

const CategoryList = () => {
  const categories = useSelector((state) => state.product.categories);

  const allCategories = categories?.map((category) => [category, ...category.subCategories]).flat();

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

  return (
    <>
      <Helmet>
        <title>Admin • Kategoriler</title>
      </Helmet>
      <Container>
        <div className="d-flex justify-content-end mb-3">
          <Button color="primary" tag={Link} to={`/admin/category`}>
            Kategori Ekle
          </Button>
        </div>
        <div className="cart-list-head">
          <div className="cart-list-title">
            <Row>
              <Col xs="12" md="3" lg="9">
                <p>Kategori İsmi</p>
              </Col>
              <Col xs="12" md="2" lg="2" className="text-center">
                <p>Düzenle</p>
              </Col>
              <Col xs="12" md="2" lg="1" className="text-center">
                <p>Sil</p>
              </Col>
            </Row>
          </div>
          {allCategories?.length ? (
            allCategories?.map((category) => (
              <div key={category.id} className="cart-single-list">
                <div className="row align-items-center">
                  <Col xs="12" md="3" lg="9">
                    {category.name}
                  </Col>
                  <Col xs="12" md="2" lg="2" className="text-center">
                    <Button color="primary" tag={Link} to={`/admin/category/${category.id}`}>
                      Düzenle
                    </Button>
                  </Col>
                  <Col xs="12" md="2" lg="1" className="text-center">
                    <Button color="danger" onClick={() => removeCategoryHandle(category)}>
                      Sil
                    </Button>
                  </Col>
                </div>
              </div>
            ))
          ) : (
            <div className="cart-single-list text-center">Kategori çeşidi bulunmamaktadır.</div>
          )}
        </div>
      </Container>
    </>
  );
};

export default CategoryList;
