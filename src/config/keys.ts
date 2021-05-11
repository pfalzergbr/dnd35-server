export interface Keys {
  COOKIE_KEY: string;
  JWT_SECRET: string
  PORT: number
  MONGO_URI: string
}

let keys: Keys;

if (process.env.NODE_ENV === 'production') {
  keys = require('./prodenv');
} else if (process.env.NODE_ENV === 'test') {
  keys = require('./testenv');
} else {
  keys = require('./devenv');
}

export default keys;