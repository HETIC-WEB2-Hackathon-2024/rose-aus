import { Divider } from '@mui/material'
import { Listing } from '.'
import { Details } from '../offres'

export default function JobsNear({offersByCommune}: {offersByCommune: any[]}) {
  return (
          <Listing title="Les offres de stage proche de chez moi">
            {offersByCommune?.map((offre) => (
              <>
                <Details
                handleOffreClick={() => {}}
                  offre={{
                    ...offre,
                    description: offre.description?.slice(0, 100),
                  }}
                />
                <Divider />
              </>
            ))}
          </Listing>
  )
}
