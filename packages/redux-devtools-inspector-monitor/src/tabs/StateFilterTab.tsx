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
}) => {
  const [value, setValue] = useState('');
  const [stateData, setStateData] = useState(nextState);
  const idx = (p:any, o:any) => p.reduce((xs:{[k: string]: any}, x:string) => ((xs && (xs[x?.trim()]) !=='undefined' || xs[x] !== null )) ? xs[x] : null, o)
  const getFilteredState = (targetValue: string) => {
    if(!targetValue){
      setStateData(nextState);
      return;
    }
    let nextStateAltered: {[k: string]: any} = {};
      // console.log(JSON.stringify(nextState))
      const inputValue = targetValue.includes(',') ? targetValue.split(',') : targetValue;
      if(Array.isArray(inputValue)){
        inputValue.forEach((val) => {
          const key = val?.trim();
          const path = key.includes('.') ? key.split('.') : key;
          console.log('idx', Array.isArray(path) ? idx(path,nextState) : path);
          if(Array.isArray(path)){
            nextStateAltered[path.join('.')] = idx(path,nextState)
          }else if(nextState[key]){
            nextStateAltered[key] = nextState[key];
          }
        })
      }else {
        const path = inputValue.includes('.') ? inputValue.split('.') : inputValue;
          console.log('path ',path)
          console.log('idx inputValue', Array.isArray(path) ? idx(path,nextState) : path);
          if(Array.isArray(path)){
            nextStateAltered[path.join('.')] = idx(path,nextState)
          }else if(nextState[inputValue]){
            nextStateAltered = nextState[inputValue];
          }
      }
      setStateData(nextStateAltered);
      console.log('nextStateAltered',nextStateAltered)
  }
  useEffect(()=>{
    getFilteredState(value);
  }, [nextState]);
  return (
    <>
    <input placeholder='Enter keys (comma separated) to filter state' style={{width: '95%', margin: '1rem'}} value={value} onChange={(e) => {
      setValue(e.target.value);
      getFilteredState(e.target.value);
    }
    }/>
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
}

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
