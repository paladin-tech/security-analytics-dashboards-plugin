/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EuiButton,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiPopover,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import { Detector } from '../../../../../models/interfaces';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { CoreServicesContext } from '../../../../components/core_services';
import { BREADCRUMBS } from '../../../../utils/constants';

export interface DetectorDetailsProps
  extends RouteComponentProps<{}, any, { detector: Detector }> {}

export interface DetectorDetailsState {
  isActionsMenuOpen: boolean;
}

export class DetectorDetails extends React.Component<DetectorDetailsProps, DetectorDetailsState> {
  static contextType = CoreServicesContext;

  constructor(props: DetectorDetailsProps) {
    super(props);
    this.state = {
      isActionsMenuOpen: false,
    };
  }

  componentDidMount(): void {
    const { name } = this.props.location.state.detector;
    this.context.chrome.setBreadcrumbs([
      BREADCRUMBS.SECURITY_ANALYTICS,
      BREADCRUMBS.DETECTORS,
      BREADCRUMBS.DETECTORS_DETAILS(name),
    ]);
  }

  toggleActionsMenu = () => {
    const { isActionsMenuOpen } = this.state;
    this.setState({ isActionsMenuOpen: !isActionsMenuOpen });
  };

  closeActionsPopover = () => {
    this.setState({ isActionsMenuOpen: false });
  };

  onDelete = () => {};

  toggleDetector = () => {};

  createHeaderActions(): React.ReactNode[] {
    const onClickActions = [
      { name: 'View Alerts', onClick: this.onViewAlertsClick },
      { name: 'View Findings', onClick: this.onViewFindingsClick },
    ];
    const { isActionsMenuOpen } = this.state;
    const { detector } = this.props.location.state;
    return [
      ...onClickActions.map((action) => (
        <EuiButton onClick={action.onClick}>{action.name}</EuiButton>
      )),
      <EuiPopover
        id={'detectorsActionsPopover'}
        button={
          <EuiButton
            iconType={'arrowDown'}
            iconSide={'right'}
            onClick={this.toggleActionsMenu}
            data-test-subj={'detectorsActionsButton'}
          >
            Actions
          </EuiButton>
        }
        isOpen={isActionsMenuOpen}
        closePopover={this.closeActionsPopover}
        panelPaddingSize={'none'}
        anchorPosition={'downLeft'}
        data-test-subj={'detectorsActionsPopover'}
      >
        <EuiContextMenuPanel
          items={[
            <EuiContextMenuItem
              key={'Delete'}
              icon={'empty'}
              onClick={() => {
                this.closeActionsPopover();
                this.onDelete();
              }}
              data-test-subj={'editButton'}
            >
              Delete
            </EuiContextMenuItem>,
            <EuiContextMenuItem
              key={'Toggle detector'}
              icon={'empty'}
              onClick={() => {
                this.closeActionsPopover();
                this.toggleDetector();
              }}
              data-test-subj={'deleteButton'}
            >
              {`${detector.enabled ? 'Stop' : 'Start'} detector`}
            </EuiContextMenuItem>,
          ]}
        />
      </EuiPopover>,
    ];
  }

  onViewAlertsClick = () => {};

  onViewFindingsClick = () => {};

  render() {
    const { detector } = this.props.location.state;

    return (
      <EuiPanel>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiFlexGroup alignItems="center">
              <EuiFlexItem grow={false}>
                <EuiTitle>
                  <h1>{detector.name}</h1>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiText>
                  <span style={{ color: `${detector.enabled ? 'green' : 'red'}` }}>
                    {detector.enabled ? 'Active' : 'Inactive'}
                  </span>
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFlexGroup justifyContent="flexEnd" alignItems="center">
              {this.createHeaderActions().map(
                (action: React.ReactNode, idx: number): React.ReactNode => (
                  <EuiFlexItem key={idx} grow={false}>
                    {action}
                  </EuiFlexItem>
                )
              )}
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel>
    );
  }
}
