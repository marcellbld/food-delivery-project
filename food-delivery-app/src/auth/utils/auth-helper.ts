import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  if (!password) return;
  return await bcrypt.hash(password, 12);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
