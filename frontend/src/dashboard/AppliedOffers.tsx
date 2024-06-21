import { Divider } from '@mui/material'
import { Listing } from '.'
import { Details } from '../offres'
import React from 'react'

export default function AppliedOffers({data}: {data: any[]}) {
  return (
          <Listing title="Offres postulées">
            {data?.map((element) => (
              <React.Fragment key={element?.id}>
                <Details
                  handleOffreClick={() => {}}
                  offre={{
                    ...element,
                    description: element.description?.slice(0, 100),
                  }}
                />
                <Divider />
              </React.Fragment>
            ))}
          </Listing>
  )
}
