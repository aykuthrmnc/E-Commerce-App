const FlattenCategories = () => {
  const categories = [
    {
      id: 1,
      name: "Elektronik",
      subcategories: [
        {
          id: 11,
          name: "Telefon",
          subcategories: [
            {
              id: 111,
              name: "Akıllı Telefon",
              subcategories: [
                { id: 1111, name: "Akıllı Telefon 1", subcategories: [] },
                { id: 1112, name: "Akıllı Telefon 2", subcategories: [] },
              ],
            },
            { id: 112, name: "Basit Telefon", subcategories: [] },
          ],
        },
        { id: 12, name: "Bilgisayar", subcategories: [] },
      ],
    },
    { id: 2, name: "Giyim", subcategories: [] },
  ];

  const flattenCategories = (categories) => {
    return categories.reduce((acc, category) => {
      acc.push(category);
      if (category.subcategories.length > 0) {
        acc = [...acc, ...flattenCategories(category.subcategories)];
      }
      return acc;
    }, []);
  };

  const flattenedCategories = flattenCategories(categories);

  const options = flattenedCategories
    .map((category) => ({
      label: category.name,
      value: category.id,
      parent: category.parent, // Kategori hiyerarşisi için
    }))
    .filter((category, index, self) => {
      // Kendisinden önceki elemanlarda aynı parent olanları filtrele
      const filtered = self.filter((c) => c.parent === category.parent);
      return filtered.findIndex((c) => c.value === category.value) === index;
    });

  return <div>FlattenCategories</div>;
};
export default FlattenCategories;
