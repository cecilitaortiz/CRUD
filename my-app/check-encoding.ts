import { query } from './src/db/db2';

async function checkEncoding() {
  try {
    console.log('🔍 Verificando codificación de DB2...\n');
    
    const result = await query(`
      SELECT 
        CODEPAGE,
        CODESET,
        TERRITORY,
        COLLATE_INFO
      FROM SYSCAT.DATABASES
      WHERE DBNAME = 'SAAC'
    `);
    
    console.log('Información de codificación:');
    console.log(result);
    
    console.log('\n📝 Probando caracteres especiales:');
    const test = await query(`
      SELECT APELLIDOS, NOMBRES 
      FROM TBL_PERSONA 
      WHERE APELLIDOS LIKE '%Ñ%' OR APELLIDOS LIKE '%Á%' OR APELLIDOS LIKE '%É%' OR APELLIDOS LIKE '%Í%'
      FETCH FIRST 5 ROWS ONLY
    `);
    
    console.log(test);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkEncoding();
