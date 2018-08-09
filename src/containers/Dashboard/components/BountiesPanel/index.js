import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import base from '../BaseStyles.module.scss';
import styles from './BountiesPanel.module.scss';
import { LoadComponent } from 'hocs';
import { map } from 'lodash';
import {
  Button,
  Card,
  ListGroup,
  Loader,
  Tabs,
  Text,
  ZeroState
} from 'components';
import { BountyItem } from '../';
import { rootBountiesSelector } from 'public-modules/Bounties/selectors';
import { rootDraftsSelector } from 'public-modules/Drafts/selectors';
import { bountiesPanelSelector } from './selectors';
import { actions as bountiesActions } from 'public-modules/Bounties';
import { actions as draftsActions } from 'public-modules/Drafts';
import { actions } from './reducer';

class BountiesPanelComponent extends React.Component {
  renderBounties = list => {
    return map(bounty => {
      const {
        calculated_fulfillmentAmount,
        created,
        fulfillment_count,
        title,
        tokenSymbol,
        usd_price
      } = bounty;

      return (
        <ListGroup.ListItem hover>
          <BountyItem
            title={title}
            submissions={fulfillment_count}
            value={parseFloat(calculated_fulfillmentAmount).toFixed(2)}
            currency={tokenSymbol}
            usd_value={parseFloat(usd_price).toFixed(0)}
            createdAt={created}
          />
        </ListGroup.ListItem>
      );
    }, list);
  };

  render() {
    const { setActiveTab, currentTab, active, drafts, history } = this.props;
    const { list, count, loading, loadingMore, loadMore, error } = this.props[
      currentTab
    ];

    let bodyClass;
    let body = (
      <React.Fragment>
        <ListGroup>{this.renderBounties(list)}</ListGroup>
        {list.length < count ? (
          <div className={base.loadMoreButton}>
            <Button
              loading={loadingMore}
              onClick={this.props[`${currentTab}LoadMore`]}
            >
              Load More
            </Button>
          </div>
        ) : null}
      </React.Fragment>
    );

    if (count <= 0) {
      bodyClass = base.bodyLoading;
      body = (
        <div className={base.zeroState}>
          <ZeroState
            title={`You have 0 ${currentTab} bounties`}
            text={
              "It looks like you don't have any active bounties at the \
              moment. Enter a title for a new bounty here to get started \
              creating one!"
            }
            action
            actionText={'Create new bounty'}
            onActionClick={() => history.push('/createBounty')}
            iconColor="blue"
          />
        </div>
      );
    }

    if (loading) {
      bodyClass = base.bodyLoading;
      body = <Loader color="blue" size="medium" />;
    }

    if (error) {
      bodyClass = base.bodyLoading;
      body = (
        <div className={base.zeroState}>
          <ZeroState
            type="error"
            text={'Something went wrong. Try again later.'}
            iconColor="red"
            icon={['far', 'exclamation-triangle']}
          />
        </div>
      );
    }

    return (
      <div className={base.cardContainer}>
        <Card className={base.card}>
          <Card.Header>
            <Card.HeaderTitle>My Bounties</Card.HeaderTitle>
            <Card.HeaderTabs
              onSelect={setActiveTab}
              activeKey={currentTab}
              defaultActiveKey={currentTab}
            >
              <Tabs.Tab
                tabColor="green"
                tabCount={active.count}
                eventKey={'active'}
              >
                Active
              </Tabs.Tab>
              <Tabs.Tab
                tabColor="blue"
                tabCount={drafts.count}
                eventKey={'drafts'}
              >
                Drafts
              </Tabs.Tab>
            </Card.HeaderTabs>
          </Card.Header>
          <Card.Body className={`${base.listGroup} ${bodyClass}`}>
            {body}
          </Card.Body>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const bountyState = rootBountiesSelector(state);
  const draftsState = rootDraftsSelector(state);

  return {
    currentTab: bountiesPanelSelector(state).currentTab,
    active: {
      list: bountyState.bounties,
      count: bountyState.count,
      offset: bountyState.offset,
      loading: bountyState.loading,
      loadingMore: bountyState.loadingMore,
      error: bountyState.error
    },
    drafts: {
      list: draftsState.drafts,
      count: draftsState.count,
      offset: draftsState.offset,
      loading: draftsState.loading,
      loadingMore: draftsState.loadingMore,
      error: draftsState.error
    }
  };
};

const BountiesPanel = compose(
  withRouter,
  connect(
    mapStateToProps,
    {
      load: actions.loadBountiesPanel,
      activeLoadMore: bountiesActions.loadMoreBounties,
      draftsLoadMore: draftsActions.loadMoreDrafts,
      setActiveTab: actions.setActiveTab
    }
  ),
  LoadComponent('')
)(BountiesPanelComponent);

export default BountiesPanel;