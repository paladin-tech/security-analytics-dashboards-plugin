/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { OPENSEARCH_DASHBOARDS_URL } from '../support/constants';
import sample_field_mappings from '../fixtures/sample_field_mappings.json';
import sample_index_settings from '../fixtures/sample_index_settings.json';

describe('Detectors', () => {
  const indexName = 'cypress-test-windows';
  const detectorName = 'test detector';

  before(() => {
    cy.cleanUpTests();

    // Create test index
    cy.createIndex(indexName, sample_index_settings);

    cy.contains(detectorName).should('not.exist');
  });

  beforeEach(() => {
    // Visit Detectors page
    cy.visit(`${OPENSEARCH_DASHBOARDS_URL}/detectors`);

    // Check that correct page is showing
    cy.waitForPageLoad('detectors', {
      contains: 'Threat detectors',
    });
  });

  it('...can be created', () => {
    // Locate Create detector button click to start
    cy.contains('Create detector').click({ force: true });

    // Check to ensure process started
    cy.waitForPageLoad('create-detector', {
      contains: 'Define detector',
    });

    // Enter a name for the detector in the appropriate input
    cy.get(`input[placeholder="Enter a name for the detector."]`).type('test detector{enter}');

    // Select our pre-seeded data source (check indexName)
    cy.get(`[data-test-subj="define-detector-select-data-source"]`).type(`${indexName}{enter}`);

    // Select threat detector type (Windows logs)
    cy.get(`input[id="windows"]`).click({ force: true });

    // Open Detection rules accordion
    cy.get('[data-test-subj="detection-rules-btn"]').click({ timeout: 5000 });

    // find search, type USB
    cy.triggerSearchField('Search...', 'USB Device Plugged');

    // Disable all rules
    cy.contains('tr', 'USB Device Plugged', { timeout: 60000 });
    cy.get('th').within(() => {
      cy.get('button').first().click({ force: true });
    });

    // enable single rule
    cy.contains('tr', 'USB Device Plugged').within(() => {
      cy.get('button').eq(1).click({ force: true });
    });

    // Click Next button to continue
    cy.get('button').contains('Next').click({ force: true });

    // Check that correct page now showing
    cy.contains('Required field mappings');

    // Select appropriate names to map fields to
    for (let field_name in sample_field_mappings.properties) {
      const mappedTo = sample_field_mappings.properties[field_name].path;

      cy.contains('tr', field_name).within(() => {
        cy.get(`[data-test-subj="detector-field-mappings-select"]`).click().type(mappedTo);
      });
    }

    // Continue to next page
    cy.get('button').contains('Next').click({ force: true, timeout: 2000 });

    // Check that correct page now showing
    cy.contains('Set up alerts');

    // Type name of new trigger
    cy.get(`input[placeholder="Enter a name for the alert condition."]`).type('test_trigger');

    // Type in (or select) tags for the alert condition
    cy.get(`[data-test-subj="alert-tags-combo-box"]`).type('attack.defense_evasion{enter}');

    // Select applicable severity levels
    cy.get(`[data-test-subj="security-levels-combo-box"]`).click({ force: true });
    cy.contains('1 (Highest)').click({ force: true });

    // Continue to next page
    cy.contains('Next').click({ force: true });

    // Confirm page is reached
    cy.contains('Review and create');

    // Confirm field mappings registered
    cy.contains('Field mapping');

    for (let field in sample_field_mappings.properties) {
      const mappedTo = sample_field_mappings.properties[field].path;

      cy.contains(field);
      cy.contains(mappedTo);
    }

    // Confirm entries user has made
    cy.contains('Detector details');
    cy.contains(detectorName);
    cy.contains('windows');
    cy.contains(indexName);
    cy.contains('Alert on test_trigger');

    // Create the detector
    cy.get('button').contains('Create').click({ force: true });
    cy.waitForPageLoad('detector-details', {
      contains: detectorName,
    });

    // Confirm detector active
    cy.contains(detectorName);
    cy.contains('Active');
    cy.contains('View Alerts');
    cy.contains('View Findings');
    cy.contains('Actions');
    cy.contains('Detector configuration');
    cy.contains('Field mappings');
    cy.contains('Alert triggers');
    cy.contains('Detector details');
    cy.contains('Created at');
    cy.contains('Last updated time');
  });

  it('...basic details can be edited', () => {
    // Click on detector name
    cy.contains(detectorName).click({ force: true });
    cy.waitForPageLoad('detector-details', {
      contains: detectorName,
    });

    // Click "Edit" button in detector details
    cy.get(`[data-test-subj="edit-detector-basic-details"]`).click({ force: true });

    // Confirm arrival at "Edit detector details" page
    cy.waitForPageLoad('edit-detector-details', {
      contains: 'Edit detector details',
    });

    // Change detector name
    cy.get(`[data-test-subj="define-detector-detector-name"]`).type('_edited');

    // Change detector description
    cy.get(`[data-test-subj="define-detector-detector-description"]`).type('Edited description');

    // Change input source
    cy.get(`[data-test-subj="define-detector-select-data-source"]`).type(
      '{backspace}.opensearch-notifications-config{enter}'
    );

    // Change detector scheduling
    cy.get(`[data-test-subj="detector-schedule-number-select"]`).type('{selectall}10');
    cy.get(`[data-test-subj="detector-schedule-unit-select"]`).select('Hours');

    // Save changes to detector details
    cy.get(`[data-test-subj="save-basic-details-edits"]`).click({ force: true });

    // Confirm taken to detector details page
    cy.waitForPageLoad('detector-details', {
      contains: detectorName,
    });

    // Verify edits are applied
    cy.contains('test detector_edited');
    cy.contains('Every 10 hours');
    cy.contains('Edited description');
    cy.contains('.opensearch-notifications-config');
  });

  it('...rules can be edited', () => {
    // Ensure start on main detectors page
    cy.waitForPageLoad('detectors', {
      contains: 'Threat detectors',
    });

    // Click on detector name
    cy.contains(detectorName).click({ force: true });
    cy.waitForPageLoad('detector-details', {
      contains: detectorName,
    });

    // Confirm number of rules before edit
    cy.contains('Active rules (1)');

    // Click "Edit" button in Detector rules panel
    cy.get(`[data-test-subj="edit-detector-rules"]`).click({ force: true });

    // Confirm arrival on "Edit detector rules" page
    cy.url().should(
      'include',
      'http://localhost:5601/app/opensearch_security_analytics_dashboards#/edit-detector-rules'
    );

    // Search for specific rule
    cy.triggerSearchField('Search...', 'USB Device');

    // Toggle single search result to unchecked
    cy.contains('tr', 'USB Device Plugged').within(() => {
      // Of note, timeout can sometimes work instead of wait here, but is very unreliable from case to case.
      cy.wait(1000);
      cy.get('button').eq(1).click();
    });

    // Save changes
    cy.get(`[data-test-subj="save-detector-rules-edits"]`).click({ force: true });

    // Confirm 1 rule has been removed from detector
    cy.contains('Active rules (0)');

    // Click "Edit" button in Detector rules panel
    cy.get(`[data-test-subj="edit-detector-rules"]`).click({ force: true });

    // Confirm arrival on "Edit detector rules" page
    cy.waitForPageLoad('edit-detector-rules', {
      contains: 'Edit detector rules',
    });

    // Search for specific rule
    cy.triggerSearchField('Search...', 'USB');

    // Toggle single search result to checked
    cy.contains('tr', 'USB Device Plugged').within(() => {
      cy.wait(2000);
      cy.get('button').eq(1).click({ force: true });
    });

    // Save changes
    cy.get(`[data-test-subj="save-detector-rules-edits"]`).click({ force: true });
    cy.waitForPageLoad('detector-details', {
      contains: detectorName,
    });

    // Confirm 1 rule has been added to detector
    cy.contains('Active rules (1)');
  });

  it('...can be deleted', () => {
    // Click on detector to be removed
    cy.contains('test detector_edited').click({ force: true });

    // Confirm page
    cy.waitForPageLoad('detector-details', {
      contains: 'Detector details',
    });

    // Click "Actions" button, the click "Delete"
    cy.contains('Actions').click({ force: true });
    cy.contains('Delete').click({ force: true });

    // Confirm detector is deleted
    cy.contains('There are no existing detectors');
  });

  after(() => cy.cleanUpTests());
});
