import { useAuth0 } from "@auth0/auth0-react";
import { Box, Modal, IconButton, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { authenticatedGet } from "../auth/helper";
import CloseIcon from "@mui/icons-material/Close";
import "./index.css";
import { Job } from "./Job";
import { useParams } from "react-router-dom";
import { ComboBox, CityComboBox } from "./Search";
export function Offres() {
  const { getAccessTokenSilently } = useAuth0(); // Hook Auth0 pour obtenir un jeton d'accès
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const [allData, setAllData] = useState<any[]>([]); // État pour stocker toutes les offres récupérées
  const [data, setData] = useState<any[]>([]); // État pour stocker les offres paginées
  const [filteredData, setFilteredData] = useState<any[]>([]); // État pour stocker les offres filtrées selon les critères de recherche
  const [error, setError] = useState<string | null>(null); // État pour stocker les messages d'erreur
  const [selectedOffre, setSelectedOffre] = useState<any | null>(null); // État pour stocker l'offre actuellement sélectionnée
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600); // État pour vérifier si l'affichage est mobile
  const [modalOpen, setModalOpen] = useState(false); // État pour gérer l'ouverture/fermeture de la modal
  const [page, setPage] = useState(0); // État pour gérer la pagination
  const itemsPerPage = 30; // Nombre d'éléments par page
  const [searchTitle, setSearchTitle] = useState<string>(""); // État pour stocker le terme de recherche par titre
  const [searchCity, setSearchCity] = useState<string>(""); // État pour stocker le terme de recherche par ville
  const [availableCities, setAvailableCities] = useState<any[]>([]); // État pour stocker les villes disponibles pour la recherche
  const { id } = useParams();
  useEffect(() => {
    async function callApi() {
      try {
        const token = await getAccessTokenSilently();
        const response = await authenticatedGet(token, `/v2/offres?limit=1000`);
        const { offres } = response;
        setAllData(offres || []);
        setFilteredData(offres || []);
        if (offres && offres.length > 0) {
          setSelectedOffre(offres[0]);
        }
        if (id) {
          handleOffreClick(offres?.find((el: any) => el.id == id));
        }
      } catch (error: any) {
        setError(`Error from web service: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
    callApi();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    const filtered = allData.filter(
      (offre: any) =>
        offre.titre_emploi.toLowerCase().includes(lowercasedTitle) &&
        offre.lieu.toLowerCase().includes(lowercasedCity)
    );
    setFilteredData(filtered);
    setPage(0);
  };

  const handleSearchChange = async (value: string) => {
    setSearchTitle(value);
  };

  useEffect(() => {
    async function changeSearch() {
      try {
        const queries = new URLSearchParams({search: searchTitle.toLowerCase()})
        const route =  searchTitle == '' ? `/v2/offres?limit=1000` : `/v1/offres/search/global?${queries}`;
        const token = await getAccessTokenSilently();
        const response = await authenticatedGet(token, route);
        const { offres } = response;
        setData(offres || []);
        console.log(offres)
        // setFilteredData(offres || []);
        // if (offres && offres.length > 0) {
        //   setSelectedOffre(offres[0]);
        // }
      } catch (error: any) {
        setError(`Error from web service: ${error.message}`);
      }
    }
    changeSearch();
  }, [searchTitle])

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
      setAvailableCities(getUniqueCities(filteredByTitle));
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

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
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
      <div
        className={`page-wrapper ${isMobile && selectedOffre ? "mobile" : ""}`}
      >
        <div
          className={`offres-list ${
            isMobile && selectedOffre ? "mobile-hide" : ""
          }`}
        >
          {error ? (
            `Dashboard: response from API (with auth) ${error}`
          ) : (
            <div className="card-wrapper">
              {data?.map((offre: any) => (
                <Details
                  key={offre?.id}
                  offre={offre}
                  handleOffreClick={handleOffreClick}
                />
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

export function Details({
  offre,
  handleOffreClick,
}: {
  offre: any;
  handleOffreClick: (offre: any) => void;
}) {
  return (
    <div
      key={offre.id}
      className="card"
      onClick={() => handleOffreClick(offre)}
    >
      <div className="card-content">
        <h3>{offre.titre_emploi}</h3>
        <div className="infos">
          <span>
            {offre.contrat}&nbsp;-&nbsp;{offre.type_contrat}
          </span>
          <span>{offre.lieu}</span>
        </div>
        <p>{offre.description_courte}</p>
      </div>
    </div>
  );
}
