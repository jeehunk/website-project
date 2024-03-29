import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import './App.css';

import Header from './components/header/header.component'
import HomePage from './pages/homepage/homepage.component'
import ShopPage from './pages/shoppage/shoppage.component'
import UserAuth from './pages/user-auth/user-auth.component'
import { auth, createUserProfileDocument } from './firebase/firebase.utils'
import { setCurrentUser } from './redux/user/user.actions'

class App extends React.Component {

  unsubscribeFromAuth = null

  componentDidMount() {
    const { setCurrentUser } = this.props

    this.unsubscribeFromAuth = auth.onAuthStateChanged( async userAuth => {
      if (userAuth) { // if a user is logged in
        const userRef = await createUserProfileDocument(userAuth)
        userRef.onSnapshot(snapShot => {
          setCurrentUser({
            currentUser: {
              id: snapShot.id,
              ...snapShot.data()
            }
          })
        })
      } else {
        setCurrentUser(userAuth)
      }

    })
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/shop' component={ShopPage} />
          <Route
            exact
            path='/auth'
            render={() =>
              this.props.currentUser ? <Redirect to='/' /> : <UserAuth />
            }
            />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
})

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
