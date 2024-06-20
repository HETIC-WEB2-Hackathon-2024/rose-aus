import { useAuth0 } from "@auth0/auth0-react";
import { Box, Modal, IconButton, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { authenticatedGet } from "../auth/helper";
import CloseIcon from '@mui/icons-material/Close';
import "./index.css";
import { Job } from "./Job";
import { ComboBox, CityComboBox } from "./Search";

export function Offres() {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffre, setSelectedOffre] = useState<any | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const itemsPerPage = 30;

  const [searchTitle, setSearchTitle] = useState<string>('');
  const [searchCity, setSearchCity] = useState<string>('');
  const [availableCities, setAvailableCities] = useState<any[]>([]);

  useEffect(() => {
    async function callApi() {
      try {
        const token = await getAccessTokenSilently();
        const response = await authenticatedGet(token, `/v2/offres?limit=100000`);
        const { offres } = response;
        setAllData(offres || []);
        setFilteredData(offres || []);
        if (offres && offres.length > 0) {
          setSelectedOffre(offres[0]);
        }
      } catch (error) {
        setError(`Error from web service: ${error.message}`);
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
  }, [getAccessTokenSilently]);

  const handleOffreClick = (offre: any) => {
    setSelectedOffre(offre);
    if (isMobile) {
      setModalOpen(true);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const filterData = () => {
    const lowercasedTitle = searchTitle.toLowerCase();
    const lowercasedCity = searchCity.toLowerCase();
    const filtered = allData.filter((offre: any) => 
      offre.titre_emploi.toLowerCase().includes(lowercasedTitle) &&
      offre.lieu.toLowerCase().includes(lowercasedCity)
    );
    setFilteredData(filtered);
    setPage(0);
  };

  const handleSearchChange = (value: string) => {
    setSearchTitle(value);
  };

  const handleCitySearchChange = (value: string) => {
    setSearchCity(value);
  };

  useEffect(() => {
    filterData();
  }, [searchTitle, searchCity]);

  useEffect(() => {
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    setData(filteredData.slice(start, end));
  }, [filteredData, page]);

  useEffect(() => {
    if (searchTitle) {
      const lowercasedTitle = searchTitle.toLowerCase();
      const filteredByTitle = allData.filter((offre: any) =>
        offre.titre_emploi.toLowerCase().includes(lowercasedTitle)
      );
      const cities = getUniqueCities(filteredByTitle);
      setAvailableCities(cities);
    } else {
      setAvailableCities(getUniqueCities(allData));
    }
  }, [searchTitle, allData]);

  const getUniqueTitles = (data: any[]) => {
    const titles = data.map((offre) => offre.titre_emploi);
    return [...new Set(titles)].map((title) => ({ label: title }));
  };

  const getUniqueCities = (data: any[]) => {
    const cities = data.map((offre) => offre.lieu);
    return [...new Set(cities)].map((city) => ({ label: city }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
  };

  return loading ? (
    <Box>chargement...</Box>
  ) : (
    <div className="search-wrapper">
      <div className="search">
        <ComboBox
          options={getUniqueTitles(allData)}
          onInputChange={handleSearchChange}
          value={searchTitle}
        />
        <CityComboBox
          options={availableCities}
          onInputChange={handleCitySearchChange}
          value={searchCity}
        />
      </div>

      <div className={`page-wrapper ${isMobile && selectedOffre ? "mobile" : ""}`}>
        <div className={`offres-list ${isMobile && selectedOffre ? "mobile-hide" : ""}`}>
          {error ? (
            `Dashboard: response from API (with auth) ${error}`
          ) : (
            <div className="card-wrapper">
              {data?.map((offre: any) => (
                <div key={offre.id} className="card" onClick={() => handleOffreClick(offre)}>
                  <div className="card-content">
                    <h3>{offre.titre_emploi}</h3>
                    <div className="infos">
                      <span>{offre.entreprise}</span>
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

      <div className="pagination-wrapper">
        <Pagination 
          count={Math.ceil(filteredData.length / itemsPerPage)} 
          page={page + 1} 
          onChange={handlePageChange} 
          color="primary" 
        />
      </div>
    </div>
  );
}