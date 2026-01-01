import {Request, Response} from 'express';
import {LoginService} from './auth.service';

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const result = await LoginService(username, password);
    res.json(result);
}