import { AppBar, makeStyles, Toolbar } from "@material-ui/core";
import { useState } from "react";
// import { useCallback } from "react";
// import { useHistory, useLocation } from "react-router";

import Transfer from "./components/Transfer";

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: "transparent",
    marginTop: theme.spacing(2),
    "& > .MuiToolbar-root": {
      margin: "auto",
      width: "100%",
      maxWidth: 1440,
    },
  },
  spacer: {
    flex: 1,
    width: "100vw",
  },
  link: {
    ...theme.typography.body2,
    fontWeight: 600,
    marginLeft: theme.spacing(4),
    textUnderlineOffset: "6px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(2.5),
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing(1),
    },
    "&.active": {
      textDecoration: "underline",
    },
  },
  bg: {
    // background:
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
  },
  brandLink: {
    display: "inline-flex",
    alignItems: "center",
    "&:hover": {
      textDecoration: "none",
    },
  },
}));

function App() {
  const classes = useStyles();
  const [aptToSol, setAptToSol] = useState(false);

  return (
    <div
      style={
        {
          // background: "#fff",
          // padding: "10px",
          // margin: "20px",
        }
      }
    >
      {/* { */}{" "}
      <AppBar
        position="static"
        elevation={0}
        style={{ background: "#240332", width: "100%", height: "100%" }}
      >
        <div style={{ display: "flex", margin: "auto" }}>
          <h1>Aptos - Solana</h1>
        </div>
        <div></div>
        {/* <Toolbar variant="dense"></Toolbar> */}
        <Transfer />{" "}
      </AppBar>
      {/* // } */}
      {/* 
      <div className={classes.spacer} />
      <div className={classes.gradientRight}></div>
      <div className={classes.gradientRight2}></div>
      <div className={classes.gradientLeft}></div>
      <div className={classes.gradientLeft2}></div> */}
    </div>
  );
}

export default App;
