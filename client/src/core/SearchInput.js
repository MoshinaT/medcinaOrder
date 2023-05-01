import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

import { Input, Ul, Li, SuggestContainer } from './style';

export default function SearchInput({
    loading,
    options,
    requests,
    onClickFunction,
    placeholder,
}) {
    const [inputValue, setInputValue] = useState('');

    const debouncedSave = useCallback(
        debounce((newValue) => requests(newValue), 1000),
        []
    );

    const updateValue = (newValue) => {
        setInputValue(newValue);
        debouncedSave(newValue);
    };

    return (
        <>
            <Input
                value={inputValue}
                onChange={(input) => updateValue(input.target.value)}
                placeholder={placeholder}
            />
            {options?.length > 0 || loading ? 
            <SuggestContainer>
                <Ul>
                    {loading && <Li>Loading...</Li>}
                    {options?.length > 0 &&
                        !loading &&
                        options?.map((value, index) => (
                            <Li
                                key={`${value._id}`}
                                onClick={() => {updateValue(value.name)}}
                            >
                                {value.name}
                            </Li>
                        ))}
                </Ul>
            </SuggestContainer>:null}
        </>
    );
}