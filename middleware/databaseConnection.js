const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabaseConnection() {
  try {
    const result = await prisma.$queryRaw`show databases;`;
    console.log('Database connection successful:', result);
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = { checkDatabaseConnection }
