import { Box } from "@mui/material";
import "./index.css";

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
                <span>{offre.contrat}&nbsp;-&nbsp;{offre.type_contrat}</span>
                <span>{offre.lieu}</span>
              </div>
              <p>{offre.description}</p>
            </div>
      ) : (
        <Box>Sélectionnez une offre pour voir les détails</Box>
      )}
    </div>
  );
}