import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ProfileDetails from './ProfileDetails';
import ProfileBounties from './ProfileBounties';
import FilterNav from './FilterNav';
import styles from './Profile.module.scss';
import { ZeroState } from 'components';
import { userInfoSelector } from 'public-modules/UserInfo/selectors';
import { getCurrentUserSelector } from 'public-modules/Authentication/selectors';
import { actions } from './reducer';

import { StickyContainer, Sticky } from 'react-sticky';

class ProfileComponent extends React.Component {
  componentWillMount() {
    const address =
      this.props.match.params.address || this.props.currentUser.public_address;
    this.props.setProfileAddress(address.toLowerCase() || '');
  }

  componentDidUpdate(prevProps) {
    const currentAddress = this.props.match.params.address;
    if (prevProps.match !== this.props.match) {
      this.props.setProfileAddress(currentAddress.toLowerCase());
    }
  }

  render() {
    const { error, loaded, user } = this.props;

    let body = (
      <div className={styles.profileContainer}>
        <div className={`${styles.profileDetails}`}>
          <ProfileDetails />
        </div>
        <div className={styles.profileBountiesContainer}>
          <div className={styles.profileBounties}>
            <FilterNav />
            <ProfileBounties />
          </div>
        </div>
      </div>
    );

    if (loaded && !user) {
      body = (
        <div className={`fullHeight ${styles.zeroStateCentered}`}>
          <ZeroState
            className={styles.centeredItem}
            iconColor="blue"
            title="No User Found"
            text="Check that the address is correct and try again"
            icon={['fal', 'bolt']}
          />
        </div>
      );
    }

    if (error) {
      body = (
        <div className={`fullHeight ${styles.zeroStateCentered}`}>
          <ZeroState
            className={styles.centeredItem}
            iconColor="red"
            title="Error"
            text="Please try again"
            icon={['fal', 'bolt']}
          />
        </div>
      );
    }

    return body;
  }
}

const mapStateToProps = state => {
  const currentUser = getCurrentUserSelector(state);
  const userInfo = userInfoSelector(state);

  return {
    currentUser,
    user: userInfo.loadedUser.user,
    loading: userInfo.loading,
    loaded: userInfo.loaded,
    error: userInfo.error
  };
};

const Profile = compose(
  connect(
    mapStateToProps,
    { setProfileAddress: actions.setProfileAddress }
  )
)(ProfileComponent);

export default Profile;
