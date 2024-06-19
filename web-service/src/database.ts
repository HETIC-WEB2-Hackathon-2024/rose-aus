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

export async function findUserCommune(id: string): Promise<any> {
  
  const q = `SELECT nom_commune_postal, c.id FROM commune as c JOIN candidat_communes as cc ON c.id = cc.commune_id JOIN candidat as cd ON cc.candidat_id = cd.id WHERE cd.id = ${id}`
  const res =  await query(q)
  if (res.length === 0)
    throw new Error("Commune not found")
  const data = res.pop()
  return {id: data.id, commune: data.nom_commune_postal}
}

export async function findOffersByCommune(communeId: string): Promise<any> {

  const q = `select * from offre as o 
join commune as co ON co.id = o.commune_id
WHERE co.id = '${communeId}' LIMIT 10`
console.log({q});

  const res =  await query(q)
  if (res.length === 0)
    throw new Error("Offer not found")
  return res
}

export function getOffres(count: number = 20, offset: number = 0): Promise<any[]> {
  return query(`SELECT * FROM offre LIMIT ${count} OFFSET ${offset}`);
}

export function getOffresBySearch(search: string = '', count: number = 20, offset: number = 0): Promise<any[]> {
  return query(`SELECT o.id, o.titre_emploi, m.metier, o.entreprise, o.lieu, o.description_courte, o.contrat, o.type_contrat, o.description, o.commune_id 
                FROM offre AS o 
                JOIN metier AS m ON o.metier_id=m.id
                WHERE o.titre_emploi LIKE '${search}'
                AND m.metier LIKE '${search}'
                AND o.description LIKE '${search}'
                LIMIT ${count} OFFSET ${offset}
                `);
}

export function getOffresByTitle(title: string, count: number = 50): Promise<any[]> {
  return query(`SELECT id, titre_emploi FROM offre WHERE titre_emploi LIKE '%${title}%' LIMIT ${count} `);
}