var Good = require('../lib/db').Good;

//user
var good = new Good({
    goodId: "",
    shop: "",
    name: "",
    prevPrice: 0,
    price: 0,
    prevTotal: 0,
    salePrice: 0,
    props: []
});

good.save((err, row) => {
    console.log(err);
});