import React from 'react';
import Fab from '@mui/material/Fab';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuth0 } from "@auth0/auth0-react";
import { authenticatedPost } from "../auth/helper";
import { Done, Warning } from '@mui/icons-material';


export function ActionSelection({id_offre}:any) {   
    const [select, setSelect] = React.useState(true);
  const { getAccessTokenSilently } = useAuth0();
  const { user} = useAuth0();

//   React.useEffect(() => {
//     async function callApi() {
//         try {
//             const token = await getAccessTokenSilently()
      
//             authenticatedPost(token, `/v1/selection/check/${id_offre}`,{email : user?.email}).then((resp)=>{
//                 setSelect(resp.response)
//             });    
//       } catch (error) {
//         setSelect(false)
//       }
//     }
//     callApi();
//   }, []);

//   async function isSelected(id_offre:any) {
//     try {
//       const token = await getAccessTokenSilently()

//       authenticatedPost(token, `/v1/selection/check/${id_offre}`,{email : user?.email}).then((resp)=>{
//           if (resp.response) {
//             return true
//             } else {
//               return false
//             }    
//       });    
//     } catch (error) {
//       return false
//     }      
//   }
  
    async function SelectionActionFetch (id_offre:any, action:string) {        
        try {
            const token = await getAccessTokenSilently()

            authenticatedPost(token, `/v1/selection/${action}/${id_offre}`,{email : user?.email}).then((resp)=>{
                console.log(action);
                console.log(resp.status);
                action==='remove'? (resp.status===201?setSelect(true) : setSelect(false)) : ((resp.status===201?setSelect(false) : setSelect(true)))
  
            });    
          } catch (error) {
            console.log(error);
          }      
        }

        function ResetSelect (){
            console.log('blurrr');
            setTimeout(()=>setSelect(true),1000)
            
        }
        if (select) {
            return (
                <Fab aria-label="like" key ={id_offre+'button'} onClick={()=>SelectionActionFetch(id_offre,'add')} onBlur={()=>ResetSelect()}>
                                <FavoriteIcon />
                </Fab>
                )
        } else {
            return (
                <Fab  aria-label="like" key={id_offre+'button'} onClick={()=>SelectionActionFetch(id_offre,'remove')} onBlur={()=>ResetSelect()}>
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

// export function AddSelection({id_offre}:any) {
  
//     function addselectUrlReturner(id_offre :any) {
//         return `/selection/add/${id_offre}`
//       }

//     return (
//         <a href={addselectUrlReturner(id_offre)}>
//         <Fab aria-label="like">
//             <FavoriteIcon />
//         </Fab>
//     </a>
//     )
// }