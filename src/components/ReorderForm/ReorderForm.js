import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { get } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { useFormState, useForm } from 'react-final-form';
import { AppIcon } from '@folio/stripes/core';

import {
  Button,
  HasCommand,
  Icon,
  Pane,
  Paneset,
  PaneFooter,
  checkScope
} from '@folio/stripes/components';

import DragAndDropFieldArray from '../DragAndDropFieldArray';
import css from './ReorderForm.css';

const ReorderForm = ({
  onClose,
  onSubmit,
  pristine,
  submitting,
}) => {
  const { values } = useFormState();
  const { change } = useForm();

  const intl = useIntl();

  // Keep weights up to date with list index in form
  useEffect(() => {
    if (values?.widgets) {
      values.widgets.forEach((wi, index) => {
        if (wi.weight !== index) {
          change(`widgets[${index}].weight`, index);
        }
      });
    }
  }, [values, change]);

  const renderPaneFooter = () => {
    return (
      <PaneFooter
        renderEnd={(
          <Button
            buttonStyle="primary mega"
            disabled={pristine || submitting}
            id="clickable-reorder-dashboard"
            marginBottom0
            onClick={onSubmit}
            type="submit"
          >
            <FormattedMessage id="stripes-components.saveAndClose" />
          </Button>
        )}
        renderStart={(
          <Button
            buttonStyle="default mega"
            id="clickable-cancel"
            marginBottom0
            onClick={onClose}
          >
            <FormattedMessage id="stripes-components.cancel" />
          </Button>
        )}
      />
    );
  };

  const getDraggableDivStyle = (draggable) => {
    return (classnames(
      css.draggableBox,
      draggable.draggableProvided.draggableProps.style,
      { [css.pickedUp]: draggable.draggableSnapshot.isDragging }
    ));
  };

  const widgetNameFromName = (name) => {
    return get(values, `${name}.name`);
  };

  const shortcuts = [
    {
      name: 'save',
      handler: (e) => {
        e.preventDefault();
        if (!pristine && !submitting) {
          onSubmit();
        }
      }
    },
  ];

  return (
    <>
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <Paneset>
          <Pane
            appIcon={<AppIcon app="dashboard" />}
            centerContent
            defaultWidth="100%"
            dismissible
            footer={renderPaneFooter()}
            id="pane-reorder-form"
            onClose={onClose}
            paneTitle={<FormattedMessage id="ui-dashboard.dashboard.reorderForm.paneTitle" />}
          >
            <FieldArray
              component={DragAndDropFieldArray}
              draggableDivStyle={getDraggableDivStyle}
              name="widgets"
              renderHandle={(name, index) => (
                <Icon
                  ariaLabel={
                intl.formatMessage(
                  { id: 'ui-dashboard.dashboard.reorderForm.dragAndDropHandleAria' },
                  { index: index + 1, widgetName: widgetNameFromName(name) }
                )
              }
                  icon="drag-drop"
                />
          )}
            >
              {(name) => {
            return widgetNameFromName(name);
          }}
            </FieldArray>
          </Pane>
        </Paneset>
      </HasCommand>
    </>
  );
};

ReorderForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool
};

export default ReorderForm;


