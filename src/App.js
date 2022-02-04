import "./styles.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import Dashboard from "./Dashboard";
import AuthProvider from "./auth";
import PrivateRoute from "./PrivateRoute";
import Profile from "./Profile";
import SelectedUser from "./SelectedUser";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute path="/user" component={SelectedUser} />
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}
