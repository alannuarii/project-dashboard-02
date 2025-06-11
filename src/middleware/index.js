import { createMiddleware } from "@solidjs/start/middleware";
import { useSession } from "vinxi/http";
import jwt from "jsonwebtoken";

console.log("[Middleware] Running middleware");
console.log("SESSION_SECRET:", process.env.SESSION_SECRET);

export default createMiddleware({
    async onRequest(event) {
        const sessionSecret = process.env.SESSION_SECRET;

        if (!sessionSecret || sessionSecret.length === 0) {
            console.error("❌ SESSION_SECRET is empty or undefined");
            throw new Error("SESSION_SECRET must be defined");
        }

        const session = await useSession({
            password: sessionSecret,
            name: "auth",
        });

        const cookieToken = session.data?.token;

        const publicPaths = ["/auth/login", "api/auth/login", "api/auth/callback"];
        const { pathname } = new URL(event.request.url);

        const isPublic = publicPaths.some(path => pathname.startsWith(path));
        if (isPublic) return;

        if (!cookieToken) {
            console.warn("⚠️ No token found, redirecting to login");
            return Response.redirect(new URL("/auth/login", event.request.url), 302);
        }

        try {
            jwt.verify(cookieToken, process.env.JWT_SECRET);
        } catch (err) {
            console.error("JWT invalid or expired", err);
            return Response.redirect(new URL("/auth/login", event.request.url), 302);
        }

        // Token valid, permintaan diteruskan
    }
});
