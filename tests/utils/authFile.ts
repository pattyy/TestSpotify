import path from 'path';
import fs from 'fs';

export const authFile = path.resolve(__dirname, '../../playwright/.auth/user.json');
export const hasAuthFile = fs.existsSync(authFile);
