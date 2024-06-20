import { useAuth0 } from "@auth0/auth0-react";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { authenticatedGet } from "../auth/helper";
import "./index.css";
import { Job } from "./Job";
import { ComboBox } from "./Search";

export function Offres() {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[] | null>(null);
  const [filteredData, setFilteredData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffre, setSelectedOffre] = useState<any | null>(null);

  useEffect(() => {
    async function callApi() {
      try {
        const token = await getAccessTokenSilently();
        const document = await authenticatedGet(token, "/v2/offres");
        setData(document);
        setFilteredData(document); // Initialize filtered data with the same data
      } catch (error) {
        setError(`Error from web service: ${error}`);
      } finally {
        setLoading(false);
      }
    }
    callApi();
  }, [getAccessTokenSilently]);

  const handleOffreClick = (offre: any) => {
    setSelectedOffre(offre);
  };

  const handleSearchChange = async (value: string) => {
    if (value) {
      const lowercasedValue = value.toLowerCase();
      const filtered = data?.filter((offre: any) =>
        offre.titre_emploi.toLowerCase().includes(lowercasedValue)
      );
      setFilteredData(filtered || []);
    } else {
      setFilteredData(data);
    }
  };

  const getUniqueTitles = (data: any[]) => {
    const titles = data.map((offre) => offre.titre_emploi);
    return [...new Set(titles)].map((title) => ({ label: title }));
  };

  return loading ? (
    <Box>chargement...</Box>
  ) : (
    <div className="search-wrapper">
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ComboBox
          options={data ? getUniqueTitles(data) : []}
          onInputChange={handleSearchChange}
        />
      </div>

      <div className="page-wrapper">
        <div className="offres-list">
          {error ? (
            `Dashboard: response from API (with auth) ${error}`
          ) : (
            <div className="card-wrapper">
              {filteredData?.map((offre: any) => (
                <Details key={offre?.id} offre={offre} handleOffreClick={handleOffreClick} />
              ))}
            </div>
          )}
        </div>
        <div className="card-content">
          <Job key={selectedOffre?.id} offre={selectedOffre} />
        </div>
      </div>
    </div>
  );
}

function Details({offre, handleOffreClick}:{offre: any, handleOffreClick: (offre: any) => void}) {
  return <div key={offre.id} className="card" onClick={() => handleOffreClick(offre)}>
    <div className="card-content">
      <h3>{offre.titre_emploi}</h3>
      <div className="infos">
        <span>{offre.contrat}&nbsp;-&nbsp;{offre.type_contrat}</span>
        <span>{offre.lieu}</span>
      </div>
      <p>{offre.description_courte}</p>
    </div>
  </div>;
}
