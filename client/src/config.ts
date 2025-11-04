const dev = {
    apiUrl : "http://localhost:3001/api",
}
const prod = {
    apiUrl : "https://prod_url.com/api",
}

const config = process.env.NODE_ENV === 'development' ? dev : prod;

export default config;
