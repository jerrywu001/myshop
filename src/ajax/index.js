const ajax = {
    uptoken() {
        return axios.get('/api/v1/uptoken');
    }
};

export default ajax;
