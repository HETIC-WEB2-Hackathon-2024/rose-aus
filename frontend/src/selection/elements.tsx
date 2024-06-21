import { useAuth0 } from "@auth0/auth0-react";
import { Done, QuestionMark } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Fab from '@mui/material/Fab';
import React, { useEffect } from 'react';
import { authenticatedPost } from "../auth/helper";

export function ActionSelection({id_offre}:any) {   
    const [select, setSelect] = React.useState('default');
  const { getAccessTokenSilently } = useAuth0();
  const { user} = useAuth0();

    async function SelectionActionFetch (id_offre:any, action:string) {        
        try {
            const token = await getAccessTokenSilently()

            await authenticatedPost(token, `/v1/selection/${action}/${id_offre}`,{email : user?.email}).then((resp)=>{
                console.log(action);
                console.log(resp.status);
                if(action === "remove"){
                    resp.status===201 ? setSelect('select') : setSelect('deselect')
                } else {
                    resp.status===201 ? setSelect('deselect') : setSelect('select')
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
                    setSelect((resp.response)?'select':'deselect')
                    
                }).catch(err=>{
                    console.log(err);
                })}
            callApi();
          }, [id_offre]);


        if (select === 'select') {
            return (
                <Fab aria-label="like" key ={id_offre+'button'} onClick={()=>SelectionActionFetch(id_offre,'add')}>
                                <FavoriteIcon />
                </Fab>
                )
        } else if (select ==='deselect') {
            
            return (
                <Fab  aria-label="like" key={id_offre+'button'} onClick={()=>SelectionActionFetch(id_offre,'remove')}>
                                <FavoriteIcon component={Done}/>
                </Fab>
                )
        } else {
            return (
                <Fab disabled aria-label="like" key={id_offre+'button'}>
                                <FavoriteIcon component={QuestionMark}/>
                </Fab>
                )
        }
    
}

export function DeSelection({setData, id_offre}:any) {


  const { getAccessTokenSilently } = useAuth0();
  const { user} = useAuth0();

  async function removeSelection () {        
    try {
        const token = await getAccessTokenSilently()

        const res = await authenticatedPost(token, `/v1/selection/remove/${id_offre}`,{email : user?.email})

        if (res.status === 201) {
            setData((data:any) => data.filter((ele :any)=> ele.id !== id_offre))
        }

      } catch (error) {
        console.log(error);
      }      
    }

    return (
        <Fab aria-label="like" onClick={removeSelection}>
            <FavoriteIcon component={Done}/>
        </Fab>
    )
}
