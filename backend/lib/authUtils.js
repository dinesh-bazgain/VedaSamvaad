const customHash = (input) => {
  let hash = 5381;
  let i = input.length;

  while (i) {
    hash = (hash * 33) ^ input.charCodeAt(--i);
  }
  return (hash >>> 0).toString(16);
};

const generateSalt = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let salt = '';
  for (let i = 0; i < 16; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return salt;
};

const hashPassword = (password, salt, iterations = 1000) => {
  let hash = password + salt;
  for (let i = 0; i < iterations; i++) {
    hash = customHash(hash);
  }
  return `${salt}:${iterations}:${hash}`;
};

const verifyPassword = (inputPassword, storedHash) => {
  const [salt, iterations, originalHash] = storedHash.split(':');
  let testHash = inputPassword + salt;
  for (let i = 0; i < parseInt(iterations); i++) {
    testHash = customHash(testHash);
  }
  return testHash === originalHash;
};

export { generateSalt, hashPassword, verifyPassword };