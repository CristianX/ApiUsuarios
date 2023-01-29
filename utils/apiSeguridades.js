const axios = require('axios');

const apiSeguridades = {
    async desencriptarEmail(email) {
        try {
            return await axios.get(`http://localhost:3001/apicrypto/decrypt/${email}`).then((response) => {
                return response.data;
            });
        } catch (error) {
            return error;
        }
    },

    async encriptarEmail(email) {
        try {
            return await axios.get(`http://localhost:3001/apicrypto/encrypt/${email}`).then((response) => {
                return response.data;
            });
        } catch (error) {
            return error;
        }
    },
};

module.exports = apiSeguridades;