import { useAuth0 } from "@auth0/auth0-react";
import { Box, Modal, IconButton, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { authenticatedGet } from "../auth/helper";
import CloseIcon from '@mui/icons-material/Close';
import "./index.css";
import { Job } from "./Job";
import { ComboBox, CityComboBox } from "./Search";

export function Offres() {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[] | null>(null);
  const [filteredData, setFilteredData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffre, setSelectedOffre] = useState<any | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const itemsPerPage = 30;

  useEffect(() => {
    async function callApi() {
      try {
        const token = await getAccessTokenSilently();
        const document = await authenticatedGet(token, `/v2/offres?limit=${itemsPerPage}&offset=${page * itemsPerPage}`);
        setData(document);
        setFilteredData(document); // Initialize filtered data with the same data
        if (document && document.length > 0) {
          setSelectedOffre(document[0]); // Set the first offer as the default selected offer
        }
      } catch (error) {
        setError(`Error from web service: ${error}`);
      } finally {
        setLoading(false);
      }
    }
    callApi();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getAccessTokenSilently, page]);

  const handleOffreClick = (offre: any) => {
    setSelectedOffre(offre);
    if (isMobile) {
      setModalOpen(true);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
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

  const handleCitySearchChange = async (value: string) => {
    if (value) {
      const lowercasedValue = value.toLowerCase();
      const filtered = data?.filter((offre: any) =>
        offre.lieu.toLowerCase().includes(lowercasedValue)
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

  const getUniqueCities = (data: any[]) => {
    const cities = data.map((offre) => offre.lieu);
    return [...new Set(cities)].map((city) => ({ label: city }));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return loading ? (
    <Box>chargement...</Box>
  ) : (
    <div className="search-wrapper">
      <div className="search">
        <ComboBox
          options={data ? getUniqueTitles(data) : []}
          onInputChange={handleSearchChange}
        />
        <CityComboBox
          options={data ? getUniqueCities(data) : []}
          onInputChange={handleCitySearchChange}
        />
      </div>

      <div className={`page-wrapper ${isMobile && selectedOffre ? "mobile" : ""}`}>
        <div className={`offres-list ${isMobile && selectedOffre ? "mobile-hide" : ""}`}>
          {error ? (
            `Dashboard: response from API (with auth) ${error}`
          ) : (
            <div className="card-wrapper">
              {filteredData?.map((offre: any) => (
                <div key={offre.id} className="card" onClick={() => handleOffreClick(offre)}>
                  <div className="card-content">
                    <h3>{offre.titre_emploi}</h3>
                    <div className="infos">
                      <span>{offre.contrat}&nbsp;-&nbsp;{offre.type_contrat}</span>
                      <span>{offre.lieu}</span>
                    </div>
                    <p>{offre.description_courte}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={`offre-details ${isMobile ? "mobile" : ""}`}>
          {!isMobile && <Job offre={selectedOffre} />}
        </div>

        <Modal
          open={modalOpen}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box className="modal-content">
            <div className="modal-header">
              <IconButton className="modal-close" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <Job offre={selectedOffre} />
          </Box>
        </Modal>
      </div>
    </div>
  );
}