import React, {useRef, useEffect} from 'react';
import { InputPlus } from '../components/InputPlus';

import styles from './index.module.scss';
import { useCheckListStore } from '../../data/stores/useCheckListStore';
import { InputField } from '../components/InputField';

interface CheckListProps {
    mainTitle?: string;
}

export const CheckList: React.FC<CheckListProps> = ({
    mainTitle = 'CheckList'
}) => {
    const [
        tasks,
        createTask,
        updateTask,
        removeTask,
        doneTask
    ] = useCheckListStore(state => [
        state.tasks,
        state.createTask,
        state.updateTask,
        state.removeTask,
        state.doneTask,

        
    ]);

    return (
        <article className={styles.article}>
            <h1 className={styles.articleTitle}>{mainTitle}</h1>
            <section className={styles.articleSection}>
                <InputPlus
                    onAdd={(title) => {
                       if (title) {
                            createTask(title)
                       } 
                    }}
                />
            </section>
            <section className={styles.articleSection}>
                {!tasks.length && (
                    <p className={styles.articleText}>Enter your task</p>
                    
                )}
                {tasks.map((task) => (
                    <InputField
                        key={task.id}
                        id={task.id}
                        isDoneTask={task.isDoneTask}
                        title={task.title}
                        onDone={doneTask}
                        onEdited={updateTask}
                        onRemoved={removeTask}
                    />
                ))}
            </section>
        </article>
    );
}

