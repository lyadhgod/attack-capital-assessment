import http from "http";
import httpProxy from "http-proxy";
import next from "next";
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import path from 'path';

const cwd = process.cwd();
dotenvExpand.expand(dotenv.config({ path: path.resolve(cwd, '.env'), override: true }));
dotenvExpand.expand(dotenv.config({ path: path.resolve(cwd, '.env.local'), override: true }));
switch (process.env.NODE_ENV) {
    case 'development':
        dotenvExpand.expand(dotenv.config({ path: path.resolve(cwd, '.env.development'), override: true }));
        dotenvExpand.expand(dotenv.config({ path: path.resolve(cwd, '.env.development.local'), override: true }));
        break;
    case 'production':
        dotenvExpand.expand(dotenv.config({ path: path.resolve(cwd, '.env.production'), override: true }));
        dotenvExpand.expand(dotenv.config({ path: path.resolve(cwd, '.env.production.local'), override: true }));
        break;
    case 'test':
        dotenvExpand.expand(dotenv.config({ path: path.resolve(cwd, '.env.test'), override: true }));
        dotenvExpand.expand(dotenv.config({ path: path.resolve(cwd, '.env.test.local'), override: true }));
        break;
}

const app = next({ dev: process.env.NODE_ENV === 'development' });
const handle = app.getRequestHandler();

const proxy = httpProxy.createProxyServer({
    target: process.env.NEXT_PUBLIC_FLASK_WEBSOCKET_URL,
    ws: true,
    changeOrigin: true
});

app.prepare().then(() => {
    const server = http.createServer(handle);

    server.on("upgrade", (req, socket, head) => {
        const url = req.url || "";

        if (!url.startsWith("/socket.io")) return;

        proxy.ws(req, socket, head);
    });

    server.listen(3000);
});
