import React from 'react';
import { TAGS_LIST } from '../constants';
import { evaluate } from 'mathjs';
import { useStore } from '../state/store';

const FormulaEditor = () => {
  const { 
    inputTag, setInputTag,
    inputTagValueText, setInputValueText,
    suggestions, setSuggestions,
    activeTag, setActiveTag,
    selectedTags, setSelectedTags,
    resultInfo, setResultInfo
  } = useStore();

  const removeOperators = (text) => {
    // Define a regular expression pattern to match the listed operators
    const operandPattern = /[+\-*/^(),]/g;

    // Use the `replace` method to remove all occurrences of operators from the text
    const remainingText = text.replace(operandPattern, '');

    return remainingText;
  }

  const getOperator = (text) => {
    // Define a regular expression pattern to match the listed operators (+, -, *, /, ^)
    const operatorPattern = /[+\-*/^(),]/g;

    // Use the `match` method to find all occurrences of operators in the text
    const operators = text.match(operatorPattern);

    return operators?.length ? operators[0] : '';
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    const textWithoutOperators = removeOperators(value);
    const operator = getOperator(value);
    setInputTag(value);

    if (value.length > 0) {
      // Filter suggestions based on user input
      const filteredSuggestions = TAGS_LIST.filter((tag) =>
        tag.title.toLowerCase().includes(textWithoutOperators.toLowerCase()) && tag.type !== 'op'
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }

    if (operator) {
      const operatorInfo = TAGS_LIST.find((tag) =>
        tag.title.toLowerCase().includes(operator.toLowerCase()) && tag.type === 'op'
      );

      if (operatorInfo) {
        setSelectedTags([...selectedTags, operatorInfo])
        setInputTag('')
      }
    }
  };

  const handleBackspace = (e) => {
    if (e.key === 'Backspace' && !inputTag) {
      // Handle the backspace event here
      const tmpTags = [...selectedTags];
      tmpTags.pop()
      setSelectedTags(tmpTags);
    }
  };

  const handleEnterSubmit = (e) => {
    if (e.key === 'Enter' && activeTag) {
      // Handle the enter key here
      const tmpList = [...selectedTags];
      const indx = selectedTags.findIndex((tag) => tag.id === activeTag.id);

      if (indx >= 0) {
        tmpList[indx]["value"] = inputTagValueText
        setSelectedTags(tmpList)
        setInputValueText('')
        setActiveTag(undefined)
      }
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSelectedTags([...selectedTags, suggestion]);
    setInputTag('')
  }

  const handleActiveTag = (element) => {
    setActiveTag(element)
    setInputValueText(element.value)
  }

  const isValueBoxEnabled = (element) => {
    return (activeTag && activeTag.id === element.id)
  }

  const onCalculate = () => {
    let formula = '';
    let value = '';

    if (selectedTags.length) {
      selectedTags.map((tag) => {
        formula = formula + tag.title
        value = value + tag.value
      })

      const result = evaluate(value)
      setResultInfo({
        formula: formula,
        output: result
      })
    }
  }

  return (
    <div>
      <div style={{ height: '50px', width: '500px', border: '1px solid black', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: '0 4px' }}>
        {selectedTags.length > 0 && (
          <ul style={{ display: 'flex', padding: '0px', margin: '0px' }}>
            {selectedTags.map((tagInfo, index) => (
              <div key={index.toString()} style={{ height: '35px', backgroundColor: tagInfo.type !== 'op' ? '#e4e4e4' : '', marginRight: '2px', display: 'flex', alignItems: 'center', padding: '2px' }}>
                <span style={{ color: 'black' }}>{tagInfo.title}</span>
                {tagInfo.type !== 'op' ? <div style={{ marginLeft: '10px', height: '80%', width: '1px', backgroundColor: 'black' }} /> : null}
                {tagInfo.type !== 'op' ? <div style={{ display: 'flex', alignItems: 'center' }}>
                  {!isValueBoxEnabled(tagInfo) ? <span style={{ color: 'black', marginLeft: '5px' }} onClick={() => handleActiveTag(tagInfo)}>{'[X]'}</span> : null}
                  {isValueBoxEnabled(tagInfo) ?
                    <input
                      type="text"
                      value={inputTagValueText}
                      onChange={(e) => setInputValueText(e.target.value)}
                      onKeyDown={handleEnterSubmit}
                      style={{ height: '25px', marginLeft: '5px', width: '40px', border: '0px', outline: 'none', boxShadow: 'none', backgroundColor: 'white' }} />
                    : null}
                </div> : null}
              </div>
            ))}
          </ul>
        )}
        <input
          type="text"
          value={inputTag}
          onChange={handleInputChange}
          onKeyDown={handleBackspace}
          style={{ border: 'none', fontSize: '30px', outline: 'none', boxShadow: 'none', backgroundColor: 'transparent' }} />
      </div>
      <div style={{ backgroundColor: '#d3d3d3' }}>
        {(inputTag.length > 0 && suggestions.length > 0) && (
          <ul style={{ padding: '0px', margin: '0px', listStyleType: 'none' }}>
            {suggestions.map((suggestion) => (
              <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)} style={{ padding: '8px', borderBottom: '1px solid black' }}>
                {suggestion.title + ' - ' + suggestion.value}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        style={{ marginTop: '20px', height: '40px', width: '200px', backgroundColor: 'blue', color: 'white', border: '0px' }}
        onClick={onCalculate}>
        Print Formula &amp; Value
      </button>

      <h5>Formula: {resultInfo.formula}</h5>
      <h5>Value: {resultInfo.output}</h5>
    </div>
  );
};

export default FormulaEditor;
