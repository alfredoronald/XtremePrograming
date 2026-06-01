import sql from 'mssql';

const connectionString = 'Driver={ODBC Driver 17 for SQL Server};Server=127.0.0.1,1433;Database=progra;Uid=sa;Pwd=SqlExpress2026;';

export const poolPromise = new sql.ConnectionPool({
    connectionString: connectionString,
    server: '127.0.0.1', 
    port: 1433,
    database: 'progra',
    user: 'sa',                 
    password: 'SqlExpress2026!', 
    options: {
        trustServerCertificate: true,
        encrypt: false          
    }
})
.connect()
.then(pool => {
    console.log('>>> [ÉXITO] ¡Conectado de forma nativa a SQL Server SQLEXPRESS! <<<');
    return pool;
})
.catch(err => {
    console.error('!!! [ERROR CRÍTICO] No se pudo hacer la conexión a SQL Server !!!');
    console.error('Detalle del error:', err.message);
    process.exit(1);
});