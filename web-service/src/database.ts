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

export function getCandidateAppliedOffers(id : string): Promise<any[]> {
  return query(`SELECT * from candidat_offres as co 
    JOIN candidat ON co.candidat_id = candidat.id  
    JOIN offre on co.offre_id = offre.id 
    AND candidat.id = ${id}`);
}

export async function findUserByEmail(email : string) : Promise<any> {
    const q = `SELECT id FROM candidat WHERE email = '${email}' LIMIT 1`
    const res =  await query(q)
    if (res.length === 0)
      throw new Error("User not found")
    return res.pop().id
}