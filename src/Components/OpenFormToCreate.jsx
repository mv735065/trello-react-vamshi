import React, { useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const OpenForm = ({ handleAddNewList, handleForm,formName={} }) => {
  let [text,setText]=useState('');
  console.log('render form');
  
  return (
    <Dialog  open={true}>
      <DialogTitle>{formName}</DialogTitle>
      <DialogContent>
        <form
          onSubmit={(e)=>{
            e.preventDefault();
            handleAddNewList(text)
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            padding: "20px",
          }}
        >
          <TextField
            value={text}
            onChange={(e)=>setText(e.target.value)}
            label="Enter  name"
            variant="outlined"
            size="small"
            autoFocus
          />
        </form>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={()=>handleAddNewList(text)}
        >
          Add 
        </Button>
        <Button
          variant="contained"
          color="red"
          onClick={() => {
            handleForm(false); // Close the form
            // listNameRef.current.value = ""; // Reset the input field
            
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OpenForm;
