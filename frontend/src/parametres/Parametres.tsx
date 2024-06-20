import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { authenticatedGet, authenticatedPost } from "../auth/helper";
import './parametre.css';

export function Parametres() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    async function callApi() {
      try {
        const token = await getAccessTokenSilently();
        const queries = new URLSearchParams({
          email: user?.email || "",
        }).toString();
        const document = await authenticatedGet(token, "/v1/candidats?" + queries);
        const userData = document.find((candidat: any) => candidat.email === user?.email);
        setData(userData ? [userData] : []);
        setFormData(userData || {});
      } catch (error) {
        setError(`Error from web service: ${error}`);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      callApi();
    }
  }, [getAccessTokenSilently, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log(`Sending update request with data: ${JSON.stringify(formData)}`);
      await authenticatedPost(token, `/v1/candidat/${formData.id}`, formData);
      setEditMode(false);
      setData([formData]);
    } catch (error) {
      setError(`Error from web service: ${error}`);
    }
  };

  return loading ? (
    <Box>Chargement...</Box>
  ) : (
    <Box>
      {error ? (
        `Parametres: Erreur depuis l'API (avec authentification) ${error}`
      ) : (
        <div>
          {data?.map((candidat: any) => (
            <div className="container" key={candidat.id}>
              <h3>Informations personnelles</h3>
              <p>Permettez aux recruteurs de vous contacter.</p>
              {editMode ? (
                <>
                <div className="modification">
                  <TextField
                    label="Nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Prénom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Adresse mail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Téléphone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Pays"
                    name="pays"
                    value={formData.pays}
                    onChange={handleChange}
                  />
                  <Button className="reus" onClick={handleSave}>Sauvegarder</Button>
                  <Button onClick={() => setEditMode(false)}>Annuler</Button>
                </div>

                </>
              ) : (
                <>
                  <div className="lastName">Nom : {candidat.nom}</div>
                  <div className="name">Prénom : {candidat.prenom}</div>
                  <div className="email">Adresse mail : {candidat.email}</div>
                  <div className="phone">Téléphone : {candidat.telephone}</div>
                  <div className="country">Pays : {candidat.pays}</div>
                  <div className="button" onClick={() => setEditMode(true)}>Modifier</div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </Box>
  );
}

export default Parametres;


