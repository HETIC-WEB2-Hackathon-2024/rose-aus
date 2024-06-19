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

export function getSelectedOffres(user_id:number): Promise<any[]> {
  return query(`SELECT * FROM selection s, offre o WHERE o.id=s.id_offre AND s.id_user = ${user_id}`);
}

export function getCandidatFromEmail(email:string): Promise<any[]> {
  return query(`SELECT * FROM candidat WHERE email= '${email}'`);
}

export function selecteOffre(id_user:any,id_offre:any): Promise<any[]> {
  return query(`INSERT INTO selection (id_offre,id_user,date_ajout) VALUES (${id_offre},${id_user}, DATE(NOW()))`);
}

export function isOffreSelected(id_user:any,id_offre:any): Promise<any[]> {
  return query(`SELECT * FROM selection WHERE id_offre= ${id_offre} AND id_user = ${id_user}`);
}

export function isOffreSelectable(email_user:any,id_offre:any): Promise<any[]> {
  return query(`SELECT * FROM candidat c, offre o WHERE c.email= '${email_user}' AND o.id = ${id_offre}`);
}

export function disSelectedOffre(id_user:any,id_offre:any): Promise<any[]> {
  return query(`DELETE FROM selection WHERE id_offre= ${id_offre} AND id_user = ${id_user}`);
}
