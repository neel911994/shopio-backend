import bcrypt from 'bcryptjs';

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
}
export const hashPassword = async(plainPassword: string): Promise<string> =>{
    return bcrypt.hash(plainPassword, 10);
}