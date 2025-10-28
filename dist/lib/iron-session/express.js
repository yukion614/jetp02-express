import { getIronSession } from 'iron-session';
import { config } from './config.js';
export async function getSession(req, res, cookieName) {
    try {
        const session = await getIronSession(req, res, {
            password: config.password,
            cookieName: cookieName,
        });
        return session;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}
export async function setSession(req, res, cookieName, key, value) {
    try {
        const session = await getIronSession(req, res, {
            password: config.password,
            cookieName: cookieName,
        });
        session[key] = value;
        await session.save();
        return session;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}
export async function deleteSession(req, res, cookieName) {
    try {
        const session = await getIronSession(req, res, {
            password: config.password,
            cookieName: cookieName,
        });
        await session.destroy();
        return null;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}
//# sourceMappingURL=express.js.map