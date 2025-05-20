const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { sendConfirmationEmail } = require('../utils/email');

const prisma = new PrismaClient();

exports.registerUser = async ({ email, password, name, role = 'buyer', username }) => {
  try {
    console.log('Trying to register:', email);

    // Case-insensitive check for existing user by email
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
        isVerified: true,  // <-- only verified users count as existing users
      },
    });
    

    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationCode = crypto.randomBytes(20).toString('hex');
    const userName = username || email.split('@')[0];

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username: userName,
        role,
        confirmationCode,
        isVerified: false,
      },
    });

    await sendConfirmationEmail(email, confirmationCode);

    console.log('New user created:', newUser.email);
    return newUser;
  } catch (error) {
    console.error('Error in registerUser:', error.message);
    throw error;
  }
};

exports.verifyUser = async (confirmationCode) => {
  const user = await prisma.user.findFirst({ where: { confirmationCode } });
  if (!user) throw new Error('Invalid confirmation link');

  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true, confirmationCode: null },
  });

  return user;
};

exports.loginUser = async ({ email, password }) => {
  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: 'insensitive',
      },
    },
  });

  if (!user) throw new Error('User not found');
  if (!user.isVerified) throw new Error('Verify your email first');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Incorrect password');

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { token, user };
};

exports.getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const { password, confirmationCode, ...userData } = user;
  return userData;
};
