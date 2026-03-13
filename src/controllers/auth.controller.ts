import {Request, Response} from 'express';
import {LoginService} from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await LoginService(email, password);
        console.log(`Login successful: ${email} at ${new Date().toISOString()}`);
        res.json(result);
    } catch (error: any) {
        console.log(`Login failed: ${req.body.email} - ${error.message}`);
        res.status(401).json({ message: error.message });
    }
}
