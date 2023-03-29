import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  RouteProps,
  useHistory,
} from "react-router-dom";
import { useEth } from "../stores/eth/ethSlice";

function PrivateRoute(props: RouteProps) {
  const eth = useEth();
  const history = useHistory();

  useEffect(() => {
    if (!eth.account) {
      history.push("/");
    }
  }, [eth.account]);

  return <Route {...props}></Route>;
}

export default PrivateRoute;
