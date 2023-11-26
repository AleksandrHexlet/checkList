import React, {useState, useRef, useEffect} from 'react';

import styles from './index.module.scss';

interface InputFieldProps {
    id: string;
    title: string;
    isDoneTask: boolean;
    onDone: (id: string) => void;
    onEdited: (id: string, title: string) => void;
    onRemoved: (id: string) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
    id,
    title,
    isDoneTask,
    onDone,
    onEdited,
    onRemoved
}) => {

    const [checked, setChecked] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [value, setValue] = useState(title);
    const editTitleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setChecked(isDoneTask)
        if (isEditMode) {
            editTitleInputRef?.current?.focus();
        }
    }, [isEditMode]);

    return (
        <div className={styles.inputField}>
            <label className={styles.inputFieldLabel}>
                <input
                    type="checkbox"
                    disabled={isEditMode}
                    checked={checked}
                    className={styles.inputFieldCheckbox}
                    onClick={() => { onDone(id) }   
                    }
                    onChange={(evt) => {
                        setChecked(evt.target.checked)}}
                />
                { isEditMode ? (
                    <input
                        value={value}
                        ref={editTitleInputRef}
                        onChange={(evt) => {
                            setValue(evt.target.value);
                        }}
                        onKeyDown={(evt) => {
                            if(evt.key === 'Enter') {
                                onEdited(id, value);
                                setIsEditMode(false);
                            }
                        }}
                        className={styles.inputFieldEditTitle}
                    />
                ) : (
                    <h3 className={ checked ?  styles.inputFieldDoneTitle :styles.inputFieldTitle}>{title}</h3>
                )}
            </label>
            { isEditMode ? (
                <button
                    aria-label="Save"
                    className={styles.inputFieldSave}
                    onClick={() => {
                        onEdited(id, value);
                        setIsEditMode(false);
                    }}
                />
            ) : (
                <button
                    aria-label="Edit"
                    className={styles.inputFieldEdit}
                    onClick={() => {
                        setIsEditMode(true);
                    }}
                />
            )}
            <button
                aria-label="Remove"
                className={styles.inputFieldRemove}
                onClick={() => {
                        onRemoved(id);
                }}
            />
        </div>
    )
};