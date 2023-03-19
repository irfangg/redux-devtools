import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { JSONTree } from 'react-json-tree';
import { Action } from 'redux';
import getItemString from './getItemString';
import getJsonTreeTheme from './getJsonTreeTheme';
import { TabComponentProps } from '../ActionPreview';

const StateFilterTab: React.FunctionComponent<
  TabComponentProps<any, Action<unknown>>
> = ({
  nextState,
  styling,
  base16Theme,
  invertTheme,
  labelRenderer,
  dataTypeKey,
  isWideLayout,
  onInspectPath
}) => {
  const [value, setValue] = useState('');
  const [stateData, setStateData] = useState(nextState);

  const idx = (p: any, o: any) =>
    p.reduce(
      (xs: { [k: string]: any }, x: string) =>
        (xs && xs?.[x?.trim()] !== 'undefined') || xs?.[x] !== null ? xs?.[x] : null,
      o
    );

  const getFilteredState = (targetValue: string) => {
    if (!targetValue) {
      setStateData(nextState);
      return;
    }
    try{
      let nextStateAltered: { [k: string]: any } = {};
      const inputValue = targetValue.includes(',')
        ? targetValue.split(',')
        : targetValue;
      if (Array.isArray(inputValue)) {
        inputValue.forEach((val) => {
          const key = val?.trim();
          const convertedKey = key.replaceAll('[','.').replaceAll(']','').replaceAll(/'/g, '')
          const path = convertedKey.includes('.') ? convertedKey.split('.') : key;
          if (Array.isArray(path)) {
            nextStateAltered[path.join('.')] = idx(path, nextState);
          } else if (nextState[key]) {
            nextStateAltered[key] = nextState[key];
          }
        });
      } else {
        const convertedInput = inputValue.replaceAll('[','.').replaceAll(']','').replaceAll(/'/g, '')
        const path = convertedInput.includes('.')
          ? convertedInput.split('.')
          : inputValue;
        if (Array.isArray(path)) {
          nextStateAltered[path.join('.')] = idx(path, nextState);
        } else if (nextState[inputValue]) {
          nextStateAltered = nextState[inputValue];
        }
      }
      setStateData(nextStateAltered);
    }catch(e){
      console.error(e);
      setStateData(nextState);
    }
  };

  useEffect(() => {
    getFilteredState(value);
  }, [nextState, value]);

  return (
    <>
      <input
        {...styling('actionListHeaderSearch')}
        placeholder="Enter keys (comma separated) to filter state"
        style={{ width: '95%' }}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onInspectPath([]);
        }}
      />
      <JSONTree
        labelRenderer={labelRenderer}
        theme={getJsonTreeTheme(base16Theme)}
        data={stateData}
        getItemString={(type, data) =>
          getItemString(styling, type, data, dataTypeKey, isWideLayout)
        }
        invertTheme={invertTheme}
        hideRoot
      />
    </>
  );
};

StateFilterTab.propTypes = {
  nextState: PropTypes.any.isRequired,
  styling: PropTypes.func.isRequired,
  base16Theme: PropTypes.any.isRequired,
  invertTheme: PropTypes.bool.isRequired,
  labelRenderer: PropTypes.func.isRequired,
  dataTypeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.symbol]),
  isWideLayout: PropTypes.bool.isRequired,
};

export default StateFilterTab;
