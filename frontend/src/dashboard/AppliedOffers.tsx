import { Divider } from '@mui/material'
import { Job } from '../offres/Job'
import {Listing} from '.'

export default function AppliedOffers({data}: {data: any[]}) {
  return (
          <Listing title="Offres postulées">
            {data?.map((element) => (
              <>
                <Job
                  offre={{
                    ...element,
                    description: element.description?.slice(0, 100),
                  }}
                />
                <Divider />
              </>
            ))}
          </Listing>
  )
}
