const ISPRODUCT = process.env.NODE_ENV === 'production'
const preUrl = ISPRODUCT ? 'http://magix.xyz' : 'http://localhost'
const config = {
  port: 3000,
  origin: 'http://localhost:8082',
  mongodb: '118.24.15.224:27017',
  preUrl:preUrl
}

module.exports = config