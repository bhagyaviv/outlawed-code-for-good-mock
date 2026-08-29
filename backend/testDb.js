const mysql = require('mysql2');

console.log('🔄 Connecting to MySQL on localhost:3306 as root...');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Connection failed!');
    console.error(err.message);
    process.exit(1);
  }
  
  console.log('✅ Connection successful!');
  
  connection.query('SHOW DATABASES', (err, results) => {
    if (err) {
      console.error('❌ Failed to retrieve databases:', err.message);
      connection.end();
      process.exit(1);
    }
    
    console.log('📂 Databases present on server:');
    results.forEach(row => {
      console.log(` - ${row.Database}`);
    });
    
    console.log('🔄 Checking outlawed_db status...');
    connection.query('CREATE DATABASE IF NOT EXISTS outlawed_db', (err) => {
      if (err) {
        console.error('❌ Failed to create/check outlawed_db:', err.message);
      } else {
        console.log('✅ Database outlawed_db is active and verified!');
      }
      connection.end();
    });
  });
});
