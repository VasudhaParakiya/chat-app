import React from "react";

import AllRoutes from "./ui/component/AllRoutes/AllRoutes";
import { AuthProvider } from "./ui/component/context/authContext";

const App = () => {
  return (
    <AuthProvider>
      <AllRoutes />
    </AuthProvider>
  );
};
export default App;

// const App = () => {
//   const {
//     loginWithPopup,
//     loginWithRedirect,
//     user,
//     isAuthenticated,
//     logout,
//     isLoading,
//   } = useAuth0();
//   console.log("🚀 ~ App ~ user:", user);

//   const callAPI = () => {
//     axios.get("http://localhost:5000/").then((res) => {
//       console.log("🚀 ~ axios.get ~ res:", res);
//     });
//   };

//   const callProtectedAPI = () => {
//     axios
//       .get("http://localhost:5000/")
//       .then((res) => {
//         console.log("🚀 ~ axios.get ~ res:", res);
//       })
//       .catch((error) => {
//         console.log("🚀 ~ axios.get ~ error:", error.message);
//       });
//   };

//   return (
//     <div>
//       <button onClick={loginWithPopup}>login with popup</button>
//       <p>{isAuthenticated && <h3> hello {user?.name}</h3>}</p>
//       {isAuthenticated ? (
//         <button onClick={() => logout()}>logout</button>
//       ) : (
//         <button onClick={(e) => loginWithRedirect()}>login</button>
//       )}

//       <div></div>
//       <br>
//         <br></br>
//       </br>
//       <ul>
//         <li>
//           <button onClick={callAPI}>cll api route</button>
//         </li>
//         <br></br>
//         <li>
//           <button onClick={callProtectedAPI}>call api protected route</button>
//         </li>
//       </ul>
//     </div>
//     // <AuthProvider>
//     //   <AllRoutes />
//     // </AuthProvider>
//   );
// };
