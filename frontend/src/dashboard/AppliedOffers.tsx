import { Divider } from '@mui/material'
import { Listing } from '.'
import { Details } from '../offres'

export default function AppliedOffers({data}: {data: any[]}) {
  return (
          <Listing title="Offres postulées">
            {data?.map((element) => (
              <>
                <Details
                  handleOffreClick={() => {}}
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
