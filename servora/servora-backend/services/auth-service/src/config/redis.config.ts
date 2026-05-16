import { createClient ,RedisClientType} from 'redis';

let client : RedisClientType;

export const redisConnect = async() => {
     client = createClient({
    username: 'default',
    password:process.env.REDIS_PASSWORD,
    socket: {
        host:process.env.REDIS_HOST,
        port: 14172
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

console.log("Auth Service redis connected successfully");

}

export const getRedisClient = () => {

    if(!client){
        throw new Error("Redis client not initialized");
    }
    return client;

}
