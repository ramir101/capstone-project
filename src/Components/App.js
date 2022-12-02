import React, { useEffect } from "react";
import Home from "./Home";
import Login from "./Login";
import { useSelector, useDispatch } from "react-redux";
import { loginWithToken } from "../store";
import { Link, Routes, Route } from "react-router-dom";

const App = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loginWithToken());
  }, []);

  // useEffect(()=> {
  //   if(auth.id){
  //     dispatch(fetchCart());
  //   }
  // }, [auth]);
  return (
    <div>
      <h1>Acme Shopping</h1>
      {auth.id ? (
        <Home />
      ) : (
        <div>
          <Login />
        </div>
      )}
      {!!auth.id && (
        <div>
          <nav>
            <Link to="/">Home</Link>
          </nav>
          <Routes></Routes>
        </div>
      )}
    </div>
  );
};

export default App;
