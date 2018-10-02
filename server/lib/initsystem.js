var Good = require('../lib/db').Good;
var Shop = require('../lib/db').Shop;

//user
var good = new Good({
    goodId: "",
    shop: "",
    name: "",
    count: 0,
    prevPrice: 0,
    price: 0,
    prevTotal: 0,
    salePrice: 0,
    realPrice: '0',
    remark: '',
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