const ajax = {
    save(options) {
        return axios.put('/api/v1/save', options);
    },
    getShops() {
        return axios.get('/api/v1/shops');
    },
    addShop(shop) {
        return axios.put('/api/v1/shop/add', shop);
    },
    searchGoods(options) {
        return axios.post('/api/v1/goods', options);
    },
    uptoken() {
        return axios.get('/api/v1/uptoken');
    }
};

export default ajax;
