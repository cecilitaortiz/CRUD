import { query } from './src/db/db2';

console.log('🔍 Explorando estructura de tablas...\n');

async function exploreTables() {
  try {
    const tables = [
      'TBL_PERSONA',
      'TBL_LUGAR_DOMICILIO',
      'TBL_TELEFONO',
      'TBL_PAIS',
      'TBL_PROVINCIA',
      'TBL_CANTON'
    ];

    for (const tableName of tables) {
      console.log(`\n📊 Tabla: ${tableName}`);
      console.log('━'.repeat(60));
      
      try {
        // Obtener estructura de columnas
        const columns = await query(`
          SELECT 
            COLNAME,
            TYPENAME,
            LENGTH,
            NULLS
          FROM SYSCAT.COLUMNS
          WHERE TABSCHEMA = 'ESPOL' 
          AND TABNAME = '${tableName}'
          ORDER BY COLNO
        `);
        
        if (columns.length > 0) {
          console.log('📋 Columnas:');
          columns.forEach((col: any) => {
            const nullable = col.NULLS === 'Y' ? 'NULL' : 'NOT NULL';
            console.log(`   - ${col.COLNAME} (${col.TYPENAME}(${col.LENGTH})) ${nullable}`);
          });
          
          // Contar registros totales
          const countResult = await query(`SELECT COUNT(*) AS TOTAL FROM ${tableName}`);
          const total = countResult[0]?.TOTAL || 0;
          console.log(`\n📊 Total de registros: ${total}`);
          
          // Mostrar 3 registros de ejemplo
          console.log(`\n🔎 Primeros 3 registros de ejemplo:`);
          const sample = await query(`
            SELECT * FROM ${tableName}
            FETCH FIRST 3 ROWS ONLY
          `);
          
          if (sample.length > 0) {
            console.log(JSON.stringify(sample, null, 2));
          }
        } else {
          console.log('⚠️  Tabla no encontrada en el schema ESPOL');
        }
        
      } catch (err: any) {
        console.error(`❌ Error al consultar ${tableName}:`, err.message);
      }
    }

    console.log('\n\n✅ Exploración completada!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

exploreTables();
