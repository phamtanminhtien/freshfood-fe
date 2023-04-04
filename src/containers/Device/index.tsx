import React from "react";
import { Route, Switch, useLocation, useParams } from "react-router-dom";
import PrivateRoute from "../../components/PrivateRoute";
import DeviceDetail from "./DeviceDetail";
import DeviceList from "./DeviceList";

function Device() {
  return (
    <Switch>
      <PrivateRoute path={`/v1/device/create`}>
        <DeviceDetail />
      </PrivateRoute>

      <PrivateRoute path={`/v1/device/:id`}>
        <DeviceDetail />
      </PrivateRoute>

      <PrivateRoute exact path={`/v1/device`}>
        <DeviceList />
      </PrivateRoute>
    </Switch>
  );
}

export default Device;
