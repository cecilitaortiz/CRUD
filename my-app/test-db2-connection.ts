import { testConnection, query } from './src/db/db2';

console.log('🔍 Probando conexión a DB2...\n');

async function runTest() {
  try {
    // 1. Test básico de conexión
    console.log('📡 Test 1: Conexión básica a la base de datos SAAC');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ No se pudo conectar a DB2');
      console.log('\n� Verifica:');
      console.log('   - Que DB2 esté corriendo');
      console.log('   - Las credenciales en el archivo .env');
      console.log('   - La red/firewall (puede alcanzar el host:puerto)');
      process.exit(1);
    }

    // 2. Información del servidor
    console.log('\n� Test 2: Información del servidor DB2');
    try {
      const serverInfo = await query(`
        SELECT 
          CURRENT SERVER AS SERVER_NAME,
          CURRENT SCHEMA AS CURRENT_SCHEMA,
          CURRENT USER AS CURRENT_USER,
          CURRENT TIMESTAMP AS SERVER_TIME
        FROM SYSIBM.SYSDUMMY1
      `);
      
      if (serverInfo.length > 0) {
        console.log('✅ Información del servidor:');
        const info = serverInfo[0];
        console.log(`   �️  Servidor: ${info.SERVER_NAME}`);
        console.log(`   📁 Schema actual: ${info.CURRENT_SCHEMA}`);
        console.log(`   👤 Usuario: ${info.CURRENT_USER}`);
        console.log(`   🕐 Hora servidor: ${info.SERVER_TIME}`);
      }
    } catch (err) {
      console.error('⚠️  Error al obtener información del servidor:', err);
    }

    console.log('\n✅ ¡Conexión exitosa! Ya puedes usar las tablas existentes en tu base de datos.');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error durante las pruebas:', error);
    process.exit(1);
  }
}

runTest();
