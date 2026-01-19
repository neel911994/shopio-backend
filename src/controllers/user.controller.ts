import { Request, Response } from "express";
import { getUsers, getUserById, createUser, deleteUser } from "../services/user.service";

export const listUsers = async (req: Request, res: Response) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const user = await getUserById(id);
        res.json(user);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const addUser = async (req: Request, res: Response) =>{
      try {
        const { name, email, password, role } = req.body;
        const user = await createUser({ name, email, password, role });
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const removeUser = async(req: Request, res: Response)=>{
    try{
        const id = req.params.id as string;
        const deletedUser =await deleteUser({id})
        res.status(200).json({message: "User deleted successfully", user: deleteUser})
    }catch (error: any){
        res.status(404).json({ message: error.message });
    }
}
