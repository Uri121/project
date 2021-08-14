import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Route, Switch, Router, Redirect } from "react-router-dom";
import { store } from "../store/reducers/combinedReducer";
import { history } from "../store/history";
import { Dashboard } from './Dashboard';
import Login from './Login';
import { loadUser } from '../store/actions/userActions';
import { Register } from './Register';


const App = () => {
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      store.dispatch(loadUser());
    }
  }, []);

  const RouteGuard = Component => ({ match }) => {
    return !store.getState().user.isAuthenticated ? (
      <Redirect to="/" />
    ) : (
      <Component match={match} />
    );
  }


  return (
    <Router history={history}>
      <Provider store={store}>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/dashboard" render={RouteGuard(Dashboard)} />
          </Switch>
        </div>
      </Provider>
    </Router>
  );
};

export default App;
