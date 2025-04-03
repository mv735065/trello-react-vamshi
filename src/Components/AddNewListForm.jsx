import React from "react";
import {  Button, TextField } from "@mui/material";

const AddNewListForm = ({handleAddNewList,setShowForm,listNameRef}) => {
  return (
    <form
      onSubmit={handleAddNewList}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        paddingTop: "20px",
        paddingRight: "20px",
      }}
    >
      <TextField
        inputRef={listNameRef}
        label="Enter List name"
        variant="outlined"
        size="small"
        autoFocus
      />
      <div style={{ display: "flex", gap: "35px" }}>
        <Button type="submit" variant="contained" color="primary">
          Add List
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setShowForm(false);
            listNameRef.current.value = ""; // Reset the input field
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddNewListForm;
