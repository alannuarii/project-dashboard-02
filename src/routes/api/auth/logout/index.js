// routes/auth/logout/+server.js
import { useSession } from "vinxi/http";
import dotenv from "dotenv";

dotenv.config();

export async function GET() {
    "use server";

    const session = await useSession({
        password: process.env.SESSION_SECRET,
        name: "session",
    });

    await session.clear();

    return new Response(null, {
        status: 302,
        headers: {
            Location: "/auth/login",
        },
    });
}
