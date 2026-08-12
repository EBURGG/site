import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: "Missing ID" });
    }

    // Try finding user by ID or Username in Redis
    const user = await redis.get(`user:${id}`);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
}
