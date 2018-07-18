import React from 'react';
import FontAwesome from 'fontAwesome';
import styles from './App.module.scss';
import { hot } from 'react-hot-loader';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { NoMatch } from 'layout';
import { NAV_ITEMS } from './constants';
import { Explorer } from 'containers';
import { Sidebar, Loader } from 'components';
import { Header } from 'layout';
import { initializedSelector } from 'public-modules/Client/selectors';
import { getCurrentUserStateSelector } from 'public-modules/Authentication/selectors';

import '../../styles/flexboxgrid.css';
import '../../font-files/inter-ui.css';

class AppComponent extends React.Component {
  renderSideNavItems() {
    return map(navItem => {
      return <Sidebar.TabIcon {...navItem} key={navItem.tabKey} />;
    }, NAV_ITEMS);
  }

  render() {
    const { loadingUser, clientInitialized, userFail } = this.props;
    const isPageLoading = loadingUser || !clientInitialized;

    return (
      <div className={styles.app}>
        {isPageLoading ? (
          <div className={`${styles.loadingBody}`}>
            {' '}
            <Loader color="white" size="medium" />
          </div>
        ) : null}
        {!isPageLoading && !userFail
          ? [
              <Header />,
              <Sidebar defaultActiveTab="dashboard" className={styles.sideNav}>
                {this.renderSideNavItems()}
              </Sidebar>,
              <div className={`${styles.body}`}>
                <Switch>
                  <Route exact path="/" component={Explorer} />
                </Switch>
              </div>
            ]
          : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const currentUserState = getCurrentUserStateSelector(state);

  return {
    clientInitialized: initializedSelector(state),
    loadingUser: currentUserState.loading,
    userFail: currentUserState.error
  };
};

const App = compose(
  connect(mapStateToProps),
  hot(module),
  withRouter
)(AppComponent);

export default App;
