// prisma/userprisma.js
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seedAdminUser = async () => {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('adminPassword', 10);
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        username: 'admin',
        role: 'admin',
        isVerified: true,
      },
    });
    console.log('✅ Admin user seeded!');
  }
};

module.exports = seedAdminUser;



// const { PrismaClient } = require("@prisma/client");

// const prisma = new PrismaClient({
//     log: ["query", "info", "warn", "error"],
// });

// module.exports = prisma;

// src/prisma/prismaclient.js
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// module.exports = prisma;