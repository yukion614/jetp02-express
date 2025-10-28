import { Request, Response } from 'express';
import type { SessionData } from '../../types/index.js';
export declare function getSession(req: Request, res: Response, cookieName: string): Promise<SessionData | null>;
export declare function setSession(req: Request, res: Response, cookieName: string, key: string, value: any): Promise<SessionData | null>;
export declare function deleteSession(req: Request, res: Response, cookieName: string): Promise<null>;
//# sourceMappingURL=express.d.ts.map