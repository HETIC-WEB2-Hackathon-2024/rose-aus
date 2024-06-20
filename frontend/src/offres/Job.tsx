import { Box } from "@mui/material";
import "./index.css";
import { ActionSelection } from "../selection/elements";
interface JobProps {
  offre: any;
}

export function Job({ offre }: JobProps) {
  return (
    <div className="offre-details">
      {offre ? (
            <div>
              <h3>{offre.titre_emploi}</h3>
              <div className="infos">
                <span>{offre.contrat}&nbsp;-&nbsp;{offre.type_contrat}</span>
                <span>{offre.lieu}</span>
              </div>
              <p>{offre.description}</p>
              <ActionSelection id_offre={offre.id}/>
            </div>
      ) : (
        <Box>Sélectionnez une offre pour voir les détails</Box>
      )}
    </div>
  );
}