const dev = {
    apiUrl : "http://localhost:3001/api",
}
const prod = {
    apiUrl : "https://9xhmunc89s.us-east-1.awsapprunner.com/api",
}

const config = process.env.NODE_ENV === 'development' ? dev : prod;

export default config;
