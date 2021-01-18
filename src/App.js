import React, { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

const ThemeContext = React.createContext({ // 1 - dichiarazione scheletro context - file separato
  theme: 'light',
  changeTheme: () => {}
})

const UselessContext = React.createContext({
  uselessBoolean: true,
  uselessHandler: () => {}
})

export default function App() {
  const [theme, setTheme] = useState('light') // 2 - utilizzo del context - theme
  const changeTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark') // 2 - utilizzo context - changeTheme

  const [uselessBoolean, setUselessBoolean] = useState(true)
  const uselessHandler = () => setUselessBoolean(uselessBoolean ? false : true) 
  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>{/* 3 - passaggio del context (tramite Context.Provider) all'albero dell'applicazione */}
        <Router>
          <div style={theme === 'dark' ? { color: 'white', backgroundColor: 'black', height: '100%' } : { color: 'black', backgroundColor: 'white' }}>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/change-theme">Change theme</Link>
              </li>
              <li>
                <Link to="/topics">Topics</Link>
              </li>
            </ul>

            <Switch>
              <Route path="/change-theme">
                {(routeprops) => {
                  console.log('routeProps: ', routeprops) 
                  return (
                    <ChangeTheme />
                )}}
              </Route>
              <Route path="/topics">
                <UselessContext.Provider value={{ uselessBoolean, uselessHandler }}>
                  <Topics />
                </UselessContext.Provider>
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
    </ThemeContext.Provider>
  );
}
// import ThemeContext from ..
function Home() {  // - 4 utilizzo context (consumer)
  const myContext = React.useContext(ThemeContext)
  return <h2>Home - theme: {myContext.theme}</h2>;
}

function ChangeTheme() {
  const { changeTheme } = useContext(ThemeContext)
  const { uselessBoolean } = useContext(UselessContext)
  return (
    <>
      <button onClick={changeTheme}>CHANGE THEME NOW!</button>
      <h5>my current useless boolean value is: {`${uselessBoolean}`}</h5>
    </>
  );
}

function Topics() {
  let match = useRouteMatch();
  const { uselessBoolean, uselessHandler } = useContext(UselessContext)
  console.log('MATCH inside Topics: ', match)

  return (
    <div>
      <h2>Topics - {`${uselessBoolean}`}</h2>

      <ul>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>
            Props v. State
          </Link>
        </li>
      </ul>

      <button onClick={uselessHandler}>USELESS HANDLER!</button>

      {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
      <Switch>
        <Route path={`${match.path}/:topicId`}>
          <Topic />
        </Route>
        <Route path={match.path}>
          <h3>Please select a topic.</h3>
        </Route>
      </Switch>
    </div>
  );
}

function Topic() {
  let { topicId } = useParams();
  return <h3>Requested topic ID: {topicId}</h3>;
}

