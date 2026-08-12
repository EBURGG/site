import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing ID" });

    let userId = id;

    // If input is NOT purely numbers (e.g. "EBURG"), look up the numeric ID first
    if (isNaN(id)) {
        userId = await redis.get(`username:${id.toLowerCase()}`);
        if (!userId) return res.status(404).json({ error: "User not found" });
    }

    // Retrieve user data by numeric ID
    const user = await redis.get(`user:${userId}`);
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json(typeof user === 'string' ? JSON.parse(user) : user);
}
