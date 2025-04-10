const useBoardNavBarStyles = () => ({
    boardNavBar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px",
      backgroundColor: "#f5f5f5",
      borderBottom: "2px solid #e0e0e0",
      width: "50vw", // Set navbar width to 50% of the viewport
      borderTopRightRadius: "50%", // Right side top rounded with 50% radius
      borderBottomRightRadius: "50%",
    },
    title: {
      fontWeight: 600,
      fontSize: "1.5rem",
      color: "black",
    },
    box:{
      flexGrow: 1,
      overflowX: "auto",
      padding: 2,
      whiteSpace: "nowrap",
    },
    mainBox:{
      display: "flex",
      flexDirection: "column",
      height: "90vh",
    }
  });

  export default useBoardNavBarStyles;