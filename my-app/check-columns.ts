import { query } from './src/db/db2';

async function checkColumns() {
  try {
    console.log('📋 Consultando columnas de TBL_PERSONA...\n');
    
    const columns = await query(`
      SELECT COLNAME, TYPENAME, LENGTH
      FROM SYSCAT.COLUMNS
      WHERE TABSCHEMA = 'ESPOL' 
      AND TABNAME = 'TBL_PERSONA'
      ORDER BY COLNO
    `);
    
    console.log('Columnas encontradas:');
    columns.forEach((col: any) => {
      console.log(`  - ${col.COLNAME} (${col.TYPENAME}(${col.LENGTH}))`);
    });
    
    console.log('\n\n📋 Consultando columnas de TBL_TELEFONO...\n');
    
    const columns2 = await query(`
      SELECT COLNAME, TYPENAME, LENGTH
      FROM SYSCAT.COLUMNS
      WHERE TABSCHEMA = 'ESPOL' 
      AND TABNAME = 'TBL_TELEFONO'
      ORDER BY COLNO
    `);
    
    console.log('Columnas encontradas:');
    columns2.forEach((col: any) => {
      console.log(`  - ${col.COLNAME} (${col.TYPENAME}(${col.LENGTH}))`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkColumns();
