export interface ExchangeRateProviderConfig {
  url: string;
  apiKey: string;
}

export interface CacheConfig {
  ttl: number;
}

export interface DatabaseConfig {
  type: string;
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
  schema: string;
}

export interface AppConfig {
  exchangeRateProvider: ExchangeRateProviderConfig;
  cache: CacheConfig;
  database: DatabaseConfig;
}

export default (): AppConfig => ({
  exchangeRateProvider: {
    url: process.env.EXCHANGE_RATE_PROVIDER_URL || '',
    apiKey: process.env.EXCHANGE_RATE_PROVIDER_API_KEY || '',
  },
  cache: {
    ttl: Number(process.env.CACHE_TTL) || 60 * 1000,
  },
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    schema: 'from_poland',
  },
});
