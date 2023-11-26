import create, { State, StateCreator } from 'zustand';

import { generateId } from '../helpers';
import { config } from 'process';

export interface Task {
    id: string;
    title: string;
    createdAt: number;
    isDoneTask: boolean;
}
export interface CheckListStore {
    tasks: Task[];
    createTask: (title: string) => void;
    updateTask: (id: string, title: string) => void;
    doneTask: (id: string) => void;
    removeTask: (id: string) => void;
    deleteEverything: () => void;
}

function isCheckListStore(object: any):object is CheckListStore{
    return 'tasks' in object

}

const localStorageUpdate=<T extends State>(config: StateCreator<T>):
StateCreator<T> => (set,get,api)=> config((nextState, ...args)=>{
    
    if(isCheckListStore(nextState)){
        window.localStorage.setItem('tasks',JSON.stringify(
            nextState.tasks
        ))
    }
    set(nextState, ...args);
},get,api);

const getCurrentState =()=> {
    try{
        const currentState = (JSON.parse(window.localStorage
            .getItem('tasks') || '[]')) as Task[];
            return currentState
    } catch(err){
        window.localStorage.setItem('tasks','[]');

    }
    return [];
}

export const useCheckListStore = create<CheckListStore>(localStorageUpdate((set, get) => ({
    tasks: getCurrentState(),
    createTask: (title) => {
        const { tasks } = get();
        const newTask = {
            id: generateId(),
            title,
            createdAt: Date.now(),
            isDoneTask:false,
        }

        set({
            tasks: [newTask].concat(tasks),
        })
    },
    updateTask: (id: string, title: string) => {
        const { tasks } = get();
        set({
            tasks: tasks.map((task) => ({
                ...task,
                title: task.id === id ? title : task.title,
            }))
        });
    },
    removeTask: (id: string) => {
        const { tasks } = get();
        set({
             tasks: tasks.filter((task) => task.id !== id),

        });
    },
    doneTask: (id: string) => {
        const { tasks } = get();
        tasks.forEach((task) => 
            task.id === id ? task.isDoneTask = !task.isDoneTask : task)

       
            // tasks.forEach((task) =>      
            // console.log("ask.isDoneTask ===  " + task.isDoneTask + ' ; TITLE == '+ task.title) ); 

       


        set({
             tasks: tasks
        });
    },

    deleteEverything: () => {
        set({}, true)
    },
})));

