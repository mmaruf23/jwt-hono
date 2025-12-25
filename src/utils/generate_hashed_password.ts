import bcrypt from 'bcryptjs';

const generate = async (s: string) => {
  return await bcrypt.hash(s, 10);
};

console.log(await generate('inisangatrahasia'));
