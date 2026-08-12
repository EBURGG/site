export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    const url = process.env.EBURG_DB_KV_REST_API_URL;
    const token = process.env.EBURG_DB_KV_REST_API_TOKEN;

    // Check if user already exists in Redis
    const checkUser = await fetch(`${url}/get/user:${username.toLowerCase()}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const existingData = await checkUser.json();

    if (existingData.result) {
        return res.status(400).json({ error: 'Username already taken' });
    }

    // Save user profile object to database
    const userPayload = JSON.stringify({
        username: username,
        password: password, // Note: In production, hash passwords with bcrypt
        joined: new Date().toISOString()
    });

    await fetch(`${url}/set/user:${username.toLowerCase()}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(userPayload)
    });

    return res.status(200).json({ success: true, message: 'Account created successfully!' });
}
