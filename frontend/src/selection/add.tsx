// import { useAuth0 } from "@auth0/auth0-react";
// import React from "react";
// import { useParams } from 'react-router-dom';

// import { authenticatedPost } from "../auth/helper";

// export function AddSelection() {
//   const { getAccessTokenSilently } = useAuth0();
//   const { user} = useAuth0();
//   const { id_offre } = useParams();
//   const [response, setResponse] = React.useState<string | null>('Ajout en cours....');


//   React.useEffect(() => {
//     async function callApi() {
//       try {
//         const token = await getAccessTokenSilently();
//         const response = await authenticatedPost(token, `/v1/selection/add/${id_offre}`,{email : user?.email});

//         if (response.status === 201) {
//             window.location.href = `/selection`;
//           } else {
//             setResponse(response.msg)
//           }               
//       } catch (error) {
//         console.log(error);
//       }
//       console.log("appellé");
      
//     }
//     console.log("appel");

//     callApi();
//   }, []);

//   return <span>{response}</span>
// }
