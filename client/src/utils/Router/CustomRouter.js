import { useLayoutEffect, useState } from "react";
import { Router } from "react-router-dom";
// import { history } from "./history";

export const CustomRouter = ({ basename, history, children }) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });
  useLayoutEffect(() => history.listen(setState), [history]);
  return <Router navigator={history} location={state.location} navigationType={state.action} children={children} basename={basename} />;
};
