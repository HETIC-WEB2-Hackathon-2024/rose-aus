import pg from "pg";

const pool = new pg.Pool({
  user: process.env.RDB_USER || "aus-user",
  database: process.env.RDB_DATABASE || "aus",
  password: process.env.RDB_PASSWORD || "aus2025",
  port: +(process.env.RDB_PORT || 5433),
  host: process.env.RDB_HOST || "localhost",
});

process.on("exit", function () {
  pool.end();
});

/**
 * Sends SQL statement to the database and returns the result
 * @param sqlStatement a string containing the SQL statement
 * @returns an array of rows
 */
async function query(sqlStatement: string): Promise<any[]> {
  let rows = [];
  const client = await pool.connect();
  const response = await client.query(sqlStatement);
  rows = response.rows;
  client.release();
  return rows;
}

export function getFirstOffres(count: number = 3): Promise<any[]> {
  return query(`SELECT * FROM offre LIMIT ${count}`);
}

export function getOffres(page: number = 1, limit: number = 20): Promise<any[]> {
  const offset = (page - 1) * limit;
  return query(`SELECT * FROM offre LIMIT ${limit} OFFSET ${offset}`);
}

export function getOffresBySearch(search: string = '', page: number = 1, limit: number = 20): Promise<any[]> {
  const offset = (page - 1) * limit;
  return query(`SELECT o.id, o.titre_emploi, m.metier, o.entreprise, o.lieu, o.description_courte, o.contrat, o.type_contrat, o.description, o.commune_id 
                FROM offre AS o 
                JOIN metier AS m ON o.metier_id=m.id
                WHERE o.titre_emploi LIKE '%${search}%'
                OR m.metier LIKE '%${search}%'
                OR o.description LIKE '%${search}%'
                LIMIT ${limit} OFFSET ${offset}`);
}

export function getOffresByTitle(title: string, limit: number = 50): Promise<any[]> {
  return query(`SELECT id, titre_emploi FROM offre WHERE titre_emploi LIKE '%${title}%' LIMIT ${limit}`);
}