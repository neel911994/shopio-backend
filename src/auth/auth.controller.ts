import {Request, Response} from 'express';
import {LoginService} from './auth.service';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await LoginService(email, password);
    res.json(result);
}