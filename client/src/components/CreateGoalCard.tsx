import { Button, Collapse } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateGoalForm from "./CreateGoalForm";
import { useState } from "react";

interface CreateGoalCardProps {
    goalCreationHandler: (description : string) => void
}

const CreateGoalCard = ({goalCreationHandler} : CreateGoalCardProps) => {

    const [ expanded, setExpanded ] = useState(false);

    const style = {
        height: "5rem",
        width: "30%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eeeded",
        fontSize: "3rem",
        boxShadow: 3,
        color: "#5A5A5A",
        '&:hover': {
          boxShadow: 6
        }
      };

  return (
        <>
            <Collapse in={!expanded}>
                <Button sx={style} onClick={() => setExpanded(true)}>
                    <AddCircleIcon fontSize="inherit" />
                </Button>
            </Collapse>
            <Collapse in={expanded}>
                <CreateGoalForm submitForm={goalCreationHandler} closeForm={() => setExpanded(false)}/>
            </Collapse>
        </>
  );
};

export default CreateGoalCard;