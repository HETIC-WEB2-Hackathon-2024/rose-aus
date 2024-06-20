import React from 'react';
import Fab from '@mui/material/Fab';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuth0 } from "@auth0/auth0-react";
import { authenticatedPost } from "../auth/helper";
import { Done, PianoOffRounded, Warning } from '@mui/icons-material';
import { useEffect } from 'react';

export function ActionSelection({offre, id_offre}:any) {   
    const [select, setSelect] = React.useState(true);
  const { getAccessTokenSilently } = useAuth0();
  const { user} = useAuth0();

    async function SelectionActionFetch (id_offre:any, action:string) {        
        try {
            const token = await getAccessTokenSilently()

            await authenticatedPost(token, `/v1/selection/${action}/${id_offre}`,{email : user?.email}).then((resp)=>{
                console.log(action);
                console.log(resp.status);
                if(action === "remove"){
                    resp.status===201 ? setSelect(true) : setSelect(false)
                } else {
                    resp.status===201 ? setSelect(false) : setSelect(true)
                }  
            });    
          } catch (error) {
            console.log(error);
          }      
        }

        useEffect(() => {
            async function callApi() {
              
                const token = await getAccessTokenSilently();
                authenticatedPost(token, `/v1/selection/check/${id_offre}`,{email : user?.email}).then((resp)=>{
                    setSelect(resp.response)
                    console.log("e,e,z,e", resp.response);
                    
                }).catch(err=>{
                    console.log(err);
                })}
            callApi();
          }, [id_offre]);


        if (select) {
            return (
                <Fab aria-label="like" key ={id_offre+'button'} onClick={()=>SelectionActionFetch(id_offre,'add')}>
                                <FavoriteIcon />
                </Fab>
                )
        } else {
            return (
                <Fab  aria-label="like" key={id_offre+'button'} onClick={()=>SelectionActionFetch(id_offre,'remove')}>
                                <FavoriteIcon component={Done}/>
                </Fab>
                )
        }
    
}

export function DeSelection({id_offre}:any) {
  
    function deselectUrlReturner(id_offre :any) {
        return `/selection/remove/${id_offre}`
      }

    return (
        <a href={deselectUrlReturner(id_offre)}>
        <Fab disabled aria-label="like">
            <FavoriteIcon />
        </Fab>
    </a>
    )
}
