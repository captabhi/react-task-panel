import React, {useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useDrop} from "react-dnd";
import Types from "../Constants";
import {updateTask} from "../CRUD_Operations";
import Paper from "@material-ui/core/Paper";
import {Typography} from "@material-ui/core";
import {convertToPriority} from "../utils";

const useStyles = makeStyles({
    taskContainer:{
        padding:'0.5rem 1rem',
        minHeight:'500px'
    },
})

function TaskContainer({taskArray,setPriorityTask,containerPriority,children}) {
    const classes = useStyles();
    const [{ isOver }, drop] = useDrop({
        accept: Types.TASK,
        drop: (item) => {
            let newTaskArray = taskArray.map((task)=>{
                if(task.id === item.id) {
                    task.priority = containerPriority;
                    updateTask(task,null);
                    return task
                }
                else return task;
            })
            setPriorityTask(newTaskArray);
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })

    return (
        <Paper variant="outlined" className={classes.taskContainer} ref={drop} >
            <Typography style={{textAlign:'center',fontSize:'1.5rem'}}>
                {convertToPriority(containerPriority)}
            </Typography>
            {children}
        </Paper>
    )
}

export default TaskContainer;
