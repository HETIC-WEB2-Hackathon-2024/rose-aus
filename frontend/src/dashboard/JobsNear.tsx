import { Divider } from '@mui/material'
import { Listing } from '.'
import { Details } from '../offres'
import React from 'react'


export default function JobsNear({offersByCommune}: {offersByCommune: any[]}) {
  return (
          <Listing title="Les offres de stage proche de chez moi">
            {offersByCommune?.map((offre: any) => (
              <React.Fragment key={offre.id}>
                <Details
                handleOffreClick={() => {}}
                  offre={{
                    ...offre,
                    description: offre.description?.slice(0, 100),
                  }}
                />
                <Divider />
              </React.Fragment>
            ))}
          </Listing>
  )
}
