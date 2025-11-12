const DB = require('./database.js');

// Wait for DB connection
setTimeout(async () => {
  const username = process.argv[2];
  const password = process.argv[3];
  
  if (!username || !password) {
    console.log('Usage: node createEmployee.js <username> <password>');
    process.exit(1);
  }
  
  try {
    await DB.createUser(username, password);
    console.log(`Employee account created: ${username}`);
  } catch (error) {
    console.error('Error creating employee:', error);
  }
  process.exit(0);
}, 2000);