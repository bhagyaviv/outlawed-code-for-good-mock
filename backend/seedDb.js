const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

console.log('🔄 Seeding outlawed_db with schema and dataset...');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  multipleStatements: true // Enable executing multiple statements
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }

  // Load schema.sql
  const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  connection.query(schemaSql, (err) => {
    if (err) {
      console.error('❌ Schema initialization failed:', err.message);
      connection.end();
      process.exit(1);
    }
    console.log('✅ DDL Schema tables created successfully!');

    // Load data.sql
    const dataPath = path.join(__dirname, '..', 'db', 'data.sql');
    const dataSql = fs.readFileSync(dataPath, 'utf8');

    connection.query(dataSql, (err) => {
      if (err) {
        console.error('❌ Seeding data failed:', err.message);
      } else {
        console.log('✅ DML Seeding populated successfully!');
        console.log('🎉 MySQL Database is fully initialized and operational!');
      }
      connection.end();
    });
  });
});
