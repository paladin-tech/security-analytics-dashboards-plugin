import React, { Component } from 'react';
import { EuiSteps, EuiText, EuiTitle, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { EuiButton } from '@elastic/eui';
import { ContentPanel } from '../../../../components/ContentPanel';

export interface OverviewStartProps {}
export interface OverviewStartState {}

const steps: any[] = [
  {
    title: 'Create security detector',
    children: (
      <>
        <EuiText>
          <p>
            Identify security findings and threats from your log datas with curated detection rules.
          </p>
        </EuiText>
        <br />
        <EuiButton fill>Create detector</EuiButton>
      </>
    ),
  },
  {
    title: 'Discover security findings',
    children: (
      <>
        <EuiText>
          <p>View</p>
        </EuiText>
        <br />
        <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false} wrap>
          <EuiFlexItem grow={false}>
            <EuiButton fill>Dashboards</EuiButton>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton>View findings</EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </>
    ),
  },
  {
    title: 'Create custom rules for detectors',
    children: (
      <>
        <EuiText>
          <p>Create rule or fine tune existing rules that can be added to detectors.</p>
        </EuiText>
        <br />
        <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false} wrap>
          <EuiFlexItem grow={false}>
            <EuiButton fill>Create rule</EuiButton>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton>Manage rules</EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </>
    ),
  },
];

export default class OverviewStart extends Component<OverviewStartProps, OverviewStartState> {
  constructor(props: OverviewStartProps) {
    super(props);
  }

  render() {
    const actions = [
      <EuiButton iconType={'arrowDown'} onClick={() => alert('click')}>
        Hide
      </EuiButton>,
    ];
    return (
      <>
        <EuiTitle size={'l'}>
          <h3>Overview</h3>
        </EuiTitle>
        <ContentPanel title={'Get started with Security analytics'} actions={actions}>
          <EuiText>
            <p>
              Security analytics generates critical security insights from existing security event
              logs
            </p>
          </EuiText>
          <br />
          <EuiSteps steps={steps} titleSize={'s'} />
        </ContentPanel>
      </>
    );
  }
}
