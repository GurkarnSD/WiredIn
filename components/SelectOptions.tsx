import styles from './styles/SelectOptions.module.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function SelectOptions(params: { type: string, optionsList: { [key: string]: string }[], selector: (options: string[]) => void, chosenOptions: string[], setSelectOptionsPanel: (state: boolean) => void, setAddOptionsPanel?: (state: boolean) => void }) {

    const { type, optionsList, selector, chosenOptions, setSelectOptionsPanel, setAddOptionsPanel } = params;

    const [inputValue, setInputValue] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<string[]>(chosenOptions);

    const options = optionsList.map((option: { [key: string]: string }) => option[Object.keys(option)[0]]);

    const filteredOptions = options.filter((option: string) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleOptionSelection = (option: string) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((o) => o !== option));
            return;
        }
        setSelectedOptions([...selectedOptions, option]);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        selector(selectedOptions);
        setSelectOptionsPanel(false);
    }

    return (
        <form className={styles.selectOptionsMenu} onSubmit={handleSubmit}>
            <div className={styles.header}>
                <div className={styles.title}>Select {type}</div>
                {setAddOptionsPanel && <FontAwesomeIcon icon={faPlus} className={styles.addSkillIcon} onClick={() => setAddOptionsPanel(true)} />}
            </div>
            <div className={styles.inputContainer}>
                <input
                    className={styles.largeInput}
                    type="text"
                    placeholder={`Search ${type}`}
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <div className={styles.selectionBox}>
                    {filteredOptions.map((option: string, index: number) => (
                        <label key={index} className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={selectedOptions.includes(option)}
                                onChange={() => handleOptionSelection(option)}
                                className={styles.customCheckbox}
                            />
                            <span className={styles.checkboxCustom}></span>
                            {option}
                        </label>
                    ))}
                </div>
            </div>
            <div className={styles.optionFooter}>
                <button className={styles.selectButton} type='submit'>Save</button>
            </div>
        </form >
    )
}