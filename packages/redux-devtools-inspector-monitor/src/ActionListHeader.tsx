import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { StylingFunction } from 'react-base16-styling';
import RightSlider from './RightSlider';

const getActiveButtons = (hasSkippedActions: boolean): ('Sweep' | 'Commit')[] =>
  [hasSkippedActions && 'Sweep', 'Commit'].filter(
    (a): a is 'Sweep' | 'Commit' => !!a
  );

interface Props {
  styling: StylingFunction;
  onSearch: (value: string) => void;
  onCommit: () => void;
  onSweep: () => void;
  hideMainButtons: boolean | undefined;
  hasSkippedActions: boolean;
  hasStagedActions: boolean;
  searchValue: string | undefined;
  actionFilterHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const ActionListHeader: FunctionComponent<Props> = ({
  styling,
  onSearch,
  hasSkippedActions,
  hasStagedActions,
  onCommit,
  onSweep,
  hideMainButtons,
  searchValue,
  actionFilterHandler,
}) => (
  <div {...styling('actionListHeader')}>
    <input
      {...styling('actionListHeaderSearch')}
      onChange={(e) => onSearch(e.target.value)}
      placeholder="filter specific action ..."
      value={searchValue}
    />
    <input
      {...styling('actionListHeaderSearch')}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => actionFilterHandler(e)}
      placeholder={'filter to exclude actions (comma separated) ...'}
    />
    {!hideMainButtons && (
      <div {...styling('actionListHeaderWrapper')}>
        <RightSlider shown={hasStagedActions} styling={styling}>
          <div {...styling('actionListHeaderSelector')}>
            {getActiveButtons(hasSkippedActions).map((btn) => (
              <div
                key={btn}
                onClick={() =>
                  ({
                    Commit: onCommit,
                    Sweep: onSweep,
                  }[btn]())
                }
                {...styling(
                  ['selectorButton', 'selectorButtonSmall'],
                  false,
                  true
                )}
              >
                {btn}
              </div>
            ))}
          </div>
        </RightSlider>
      </div>
    )}
  </div>
);

ActionListHeader.propTypes = {
  styling: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onCommit: PropTypes.func.isRequired,
  onSweep: PropTypes.func.isRequired,
  hideMainButtons: PropTypes.bool,
  hasSkippedActions: PropTypes.bool.isRequired,
  hasStagedActions: PropTypes.bool.isRequired,
};

export default ActionListHeader;
