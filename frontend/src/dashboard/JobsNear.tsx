import { Divider } from '@mui/material'
import { Job } from '../offres/Job'
import {Listing} from '.'

export default function JobsNear({offersByCommune}: {offersByCommune: any[]}) {
  return (
          <Listing title="Les offres de stage proche de chez moi">
            {offersByCommune?.map((offre) => (
              <>
                <Job
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
