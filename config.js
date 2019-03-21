const ISPRODUCT = process.env.NODE_ENV === 'production'
console.log(process.env)
const preUrl = ISPRODUCT ? 'http://magix.xyz' : 'http://localhost'
const config = {
  port: 3000,
  ip:'magix.xyz',
  origin: 'http://localhost:8082',
  mongodb: '118.24.15.224:27017',
  preUrl:preUrl
}

module.exports = config