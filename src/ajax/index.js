const ajax = {
    save(options) {
        return axios.put('/api/v1/save', options);
    },
    uptoken() {
        return axios.get('/api/v1/uptoken');
    }
};

export default ajax;
