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
    getGood(id) {
        return axios.get(`/api/v1/good/${id}`);
    },
    updateGood(options) {
        return axios.put('/api/v1/good/update', options);
    },
    deleteGood(id) {
        return axios.delete(`/api/v1/good/${id}`);
    },
    uptoken() {
        return axios.get('/api/v1/uptoken');
    },
    getAllMonths() {
        return axios.get('/api/v1/months');
    },
    saveWithMonth(params) {
        return axios.put('/api/v1/months', params);
    },
};

export default ajax;
