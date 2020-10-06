import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Types from "../Constants";
import {makeStyles} from "@material-ui/core/styles";
import {DndProvider,useDrag} from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const useStyles = makeStyles({
    taskHeading:{
        textAlign:'center'
    },
    task:{
        margin:'0.3rem'
    },
    taskBeingDragged:{
        opacity:'0.5',
        backGroundColor:'red'
    }
})
function TaskComponent({task,currentContainer}) {
    const [{isDragging}, taskRef] = useDrag({
        item: { type: Types.TASK,id:task.id },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })

    const classes = useStyles();

    return (
            <Paper elevation={3} ref={taskRef} className={classes.task} classes={isDragging?classes.taskBeingDragged:''}>
                <Typography className={classes.taskHeading}>
                    {task.message}
                </Typography>
            </Paper>
    )
}
export default TaskComponent;