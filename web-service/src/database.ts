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

export function getTotalOffresCount(): Promise<any[]> {
  return query(`SELECT COUNT(*) FROM offre`);
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
  const q = `SELECT nom_commune_postal, c.id FROM commune as c 
    JOIN candidat_communes as cc ON c.id = cc.commune_id 
    JOIN candidat as cd ON cc.candidat_id = cd.id 
    WHERE cd.id = ${id}`
  const res =  await query(q)
  if (res.length === 0)
    throw new Error("Commune not found")
  const data = res.pop()
  return {id: data.id, commune: data.nom_commune_postal}
}

export async function findOffersByCommune(communeId: string): Promise<any> {
  const q = `select 
  o.id,
  o.secteur_id,
  o.metier_id,
  o.titre_emploi,
  o.entreprise,
  o.lieu,
  o.description_courte,
  o.contrat,
  o.type_contrat,
  o.description,
  o.commune_id,
  co.code_commune_insee,
  co.nom_commune_postal,
  co.code_postal,
  co.libelle_acheminement,
  co.nom_commune,
  co.nom_commune_complet,
  co.code_departement,
  co.nom_departement,
  co.code_region,
  co.nom_region 
  from offre as o 
  join commune as co ON co.id = o.commune_id
  WHERE co.id = '${communeId}' LIMIT 10`

  const res =  await query(q)
  if (res.length === 0)
    throw new Error("Offer not found")
  return res
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
export function getOffres(count: number = 100, offset: number = 0): Promise<any[]> {
  return query(`SELECT * FROM offre LIMIT ${count} OFFSET ${offset}`);
}


// export function getCandidats(): Promise<any[]> {
//   return query(`SELECT * FROM candidat`);
// }

export function getCandidats(): Promise<any[]> {
  return query(`
    SELECT c.*, cc.commune_id
    FROM candidat c
    LEFT JOIN candidat_communes cc ON c.id = cc.candidat_id
  `);
}

export async function updateCandidat(id: string, data: any): Promise<any> {
  const { nom, prenom, email, telephone, pays} = data;
  const q = `
    UPDATE candidat
    SET 
      nom = '${nom}', 
      prenom = '${prenom}', 
      email = '${email}', 
      telephone = '${telephone}', 
      pays = '${pays}'
    WHERE id = ${id}
    RETURNING *;
  `;
  console.log(`Executing query: ${q}`);
  const res = await query(q);

  if (res.length === 0) throw new Error("Candidat not found");
  return res.pop();
}

export async function updateCommune(id: string, data: any): Promise<any> {
  const {commune_id} = data;
  const q = `
    UPDATE candidat_communes
    SET 
    commune_id = '${commune_id}'
    WHERE candidat_id = ${id};
  `;
}




// commune 

// export function getCandidatCommunes(): Promise<any[]> {
//   return query(`SELECT * FROM candidat_communes`);
// }


// export async function updateCandidatCommune(candidat_id: string, data: any): Promise<any> {
//   const { commune_id } = data;
//   const q = `
//     UPDATE candidat_communes
//     SET 
//       commune_id = '${commune_id}'
//     WHERE candidat_id = ${candidat_id}
//     RETURNING *;
//   `;
//   console.log(`Executing query: ${q}`);
//   const res = await query(q);
//   if (res.length === 0) throw new Error("Candidat Commune not found");
//   return res.pop();
// }


export function getOffresBySearch(search: string = '', count: number = 60, offset: number = 0): Promise<any[]> {
  return query(`SELECT o.id, o.titre_emploi, m.metier, o.entreprise, o.lieu, o.description_courte, o.contrat, o.type_contrat, o.description, o.commune_id 
                FROM offre AS o 
                JOIN metier AS m ON o.metier_id=m.id
                WHERE LOWER(o.titre_emploi) LIKE '%${search}%'
                OR LOWER(m.metier) LIKE '%${search}%'
                LIMIT ${count} OFFSET ${offset}`);
}

export function getOffresByTitle(title: string, count: number = 50): Promise<any[]> {
  return query(`SELECT id, titre_emploi FROM offre WHERE titre_emploi LIKE '%${title}%' LIMIT ${count}`);
}
