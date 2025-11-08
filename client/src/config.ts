const dev = {
    apiUrl : "http://localhost:3001/api",
}
const prod = {
    apiUrl : "http://35.154.95.127:3001/api",
}

const config = process.env.NODE_ENV === 'development' ? dev : prod;

export default config;
