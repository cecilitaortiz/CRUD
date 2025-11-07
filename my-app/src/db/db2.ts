// @ts-ignore
import * as ibmdb from 'ibm_db';
import dotenv from 'dotenv';

dotenv.config();

const DB2_CONN = process.env.DB2_CONN;

if (!DB2_CONN) {
  throw new Error('❌ DB2_CONN no está definida en las variables de entorno (.env)');
}

// Pool de conexiones - Configuración
// @ts-ignore
const pool = new ibmdb.Pool();
const poolConfig = {
  connectionString: DB2_CONN,
  maxPoolSize: 5 
};

/**
 * Ejecuta una query SQL en DB2 usando el pool de conexiones
 * @param sql - Query SQL 
 * @param params - Array de parámetros
 * @returns Promise con los resultados
 */
export function query(sql: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    pool.open(poolConfig.connectionString, (err: any, conn: any) => {
      if (err) {
        console.error('❌ Error al obtener conexión del pool:', err);
        return reject(err);
      }

      conn.prepare(sql, (errPrepare: any, stmt: any) => {
        if (errPrepare) {
          console.error('❌ Error al preparar statement:', errPrepare);
          conn.close(() => {}); 
          return reject(errPrepare);
        }

        stmt.execute(params, (errExec: any, result: any) => {
          if (errExec) {
            console.error('❌ Error al ejecutar query:', errExec);
            try { stmt.closeSync && stmt.closeSync(); } catch {}
            conn.close(() => {}); 
            return reject(errExec);
          }

          // Obtener resultados
          result.fetchAll((errFetch: any, data: any[]) => {
            try { result.closeSync && result.closeSync(); } catch {}
            try { stmt.closeSync && stmt.closeSync(); } catch {}
            conn.close(() => {}); 

            if (errFetch) {
              console.error('❌ Error al obtener resultados:', errFetch);
              return reject(errFetch);
            }

            // Procesar resultados 
            let processedData = data || [];
            
            // Si los datos vienen en formato { value: [...] }, extraer el array
            if (processedData && typeof processedData === 'object' && 'value' in processedData) {
              processedData = (processedData as any).value;
            }

            // Convertir buffers a strings UTF-8 si es necesario
            if (Array.isArray(processedData)) {
              processedData = processedData.map(row => {
                const newRow: any = {};
                for (const key in row) {
                  if (Buffer.isBuffer(row[key])) {
                    newRow[key] = row[key].toString('utf8');
                  } else if (typeof row[key] === 'string') {
                    newRow[key] = row[key];
                  } else {
                    newRow[key] = row[key];
                  }
                }
                return newRow;
              });
            }

            resolve(Array.isArray(processedData) ? processedData : []);
          });
        });
      });
    });
  });
}

/**
 * Ejecuta un statement SQL (INSERT, UPDATE, DELETE) sin retornar filas
 * @param sql - Statement SQL
 * @param params - Array de parámetros
 * @returns Promise con el número de filas afectadas
 */
export function execute(sql: string, params: any[] = []): Promise<number> {
  return new Promise((resolve, reject) => {
    pool.open(poolConfig.connectionString, (err: any, conn: any) => {
      if (err) {
        console.error('❌ Error al obtener conexión del pool:', err);
        return reject(err);
      }

      conn.prepare(sql, (errPrepare: any, stmt: any) => {
        if (errPrepare) {
          console.error('❌ Error al preparar statement:', errPrepare);
          conn.close(() => {}); 
          return reject(errPrepare);
        }

        stmt.execute(params, (errExec: any, result: any) => {
          // Limpiar recursos
          try { stmt.closeSync && stmt.closeSync(); } catch {}
          conn.close(() => {}); 

          if (errExec) {
            console.error('❌ Error al ejecutar statement:', errExec);
            return reject(errExec);
          }

          resolve(result?.length || 0);
        });
      });
    });
  });
}


export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT 1 FROM SYSIBM.SYSDUMMY1');
    console.log('✅ Conexión a DB2 exitosa!', result);
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a DB2:', error);
    return false;
  }
}

export default { query, execute, testConnection };
