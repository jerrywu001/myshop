var Good = require('../lib/db').Good;
var Shop = require('../lib/db').Shop;

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

var shop = new Shop({
    value: "",
    label: "",
});

shop.save((err, row) => {
    console.log(err);
});