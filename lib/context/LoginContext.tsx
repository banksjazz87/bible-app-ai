import { createContext, useReducer, JSX } from "react";

export const IsLoggedInContext = createContext<boolean>(false);
export const LoggedInDispatcher = createContext<boolean>(false);

type LoginProviderTypes = {
	children: JSX.Element;
};

// export function LoginProvider({ children }: LoginProviderTypes) {
//     const [isLoggedIn, dispatch] = useReducer(
//         loginReducer,
//         initialLogin
//     );

//     return (
//         <TasksContext.Provider value={isLoggedIn}>
//             <TasksDispatchContext.Provider value={dispatch}>
//                 {children}
//             </TasksDispatchContext.Provider>
//         </TasksContext.Provider>
//     )
// }