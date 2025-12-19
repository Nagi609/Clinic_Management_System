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

    // Get new credentials from environment or command line
    const newUsername = process.env.NEW_USERNAME || process.argv[2] || 'admin'
    const newEmail = process.env.NEW_EMAIL || process.argv[3] || 'admin@clinic.com'
    const newPassword = process.env.NEW_PASSWORD || process.argv[4]

    if (!newPassword) {
      console.error('Password is required. Set via NEW_PASSWORD env or pass as argument')
      process.exit(1)
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        username: newUsername,
        email: newEmail,
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
