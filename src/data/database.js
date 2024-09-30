import initSqlJs from 'sql.js';

// Función para inicializar o cargar la base de datos
const initializeDatabase = async () => {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
    });

    let db;

    // Verifica si hay una base de datos existente en localStorage
    const savedDb = localStorage.getItem('myDatabase');

    if (savedDb) {
        // Cargar la base de datos desde localStorage
        const arrayBuffer = new Uint8Array(JSON.parse(savedDb));
        db = new SQL.Database(arrayBuffer);
        console.log("Database loaded from localStorage");
    } else {
        // Crear una nueva base de datos
        db = new SQL.Database();
        console.log("New database created");

        // Crear las tablas solo si no existe la base de datos
        db.run(`
        CREATE TABLE girl (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          prompt TEXT NOT NULL,
          avatarId INTEGER NOT NULL
        );
      `);

        db.run(`
        CREATE TABLE message (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          girlId INTEGER NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('assistant', 'user')),
          content TEXT NOT NULL,
          FOREIGN KEY (girlId) REFERENCES girl(id)
        );
      `);

        db.run(`
        CREATE TABLE memory (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          girlId INTEGER NOT NULL,
          memories TEXT NOT NULL,
          FOREIGN KEY (girlId) REFERENCES girl(id)
        );
      `);

        // Guardar la base de datos en localStorage
        saveDatabase(db);
    }

    return db;
};

// Función para guardar la base de datos en localStorage
const saveDatabase = (db) => {
    const binaryArray = db.export();
    localStorage.setItem('myDatabase', JSON.stringify(Array.from(binaryArray)));
};

export default {
    initializeDatabase,
    saveDatabase
};
