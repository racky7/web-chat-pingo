import { useContext } from "react";
import { AuthContext } from "../src/auth";
import { Redirect, Route } from "react-router-dom";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      exact
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}
