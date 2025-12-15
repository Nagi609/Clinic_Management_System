// Simple script to initialize the database
const { execSync } = require('child_process');

try {
  console.log('Initializing database...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('✓ Database initialized successfully');
} catch (error) {
  console.error('✗ Failed to initialize database:', error.message);
  process.exit(1);
}
