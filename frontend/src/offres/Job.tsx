import { Box } from "@mui/material";
import "./index.css";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

interface JobProps {
  offre: any;
}

export function Job({ offre }: JobProps) {
  return (
    <div>
      {offre ? (
            <div>
              <h3>{offre.titre_emploi}</h3>
              <div className="infos">
                <span>{offre.entreprise}</span>
                <span>{offre.contrat}&nbsp;-&nbsp;{offre.type_contrat}</span>
                <span>{offre.lieu}</span>
              </div>
              <p>{offre.description}</p>
              <div className="add-button">
              <Fab size="small" color="primary" aria-label="add">
                <AddIcon />
              </Fab>
              </div>
            </div>
      ) : (
        <Box>Sélectionnez une offre pour voir les détails</Box>
      )}
    </div>
  );
}