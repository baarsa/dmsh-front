import React from "react";

export const stores = Object.freeze({
  //createSubject: new CreateSubjectViewModel()
});

export const storesContext = React.createContext(stores);
export const StoresProvider = storesContext.Provider;
