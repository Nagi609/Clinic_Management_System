// Script to update the Justin account to sorsuclinic
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateUser() {
  try {
    console.log('Starting user update...');

    // Find the existing Justin user
    const existingUser = await prisma.user.findUnique({
      where: { username: 'Justin' },
    });

    if (!existingUser) {
      console.error('User "Justin" not found');
      process.exit(1);
    }

    console.log(`Found user: ${existingUser.username} (${existingUser.email})`);

    // Hash the new password
    const hashedPassword = await bcrypt.hash('Sorsuclinic@2025', 10);

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        username: 'sorsuclinic',
        email: 'sorsuclinic@gmail.com',
        password: hashedPassword,
        fullName: 'SorSU Clinic',
        role: 'admin',
      },
    });

    console.log('✓ User updated successfully!');
    console.log(`  Username: ${updatedUser.username}`);
    console.log(`  Email: ${updatedUser.email}`);
    console.log(`  Role: ${updatedUser.role}`);
    console.log(`  Full Name: ${updatedUser.fullName}`);
    console.log('\nAll associated data (patients, visits, etc.) has been preserved.');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error updating user:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateUser();
