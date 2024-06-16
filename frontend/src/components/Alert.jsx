import React from "react";

const Alert = ({ type, children }) => {
  const style = {
    1: "alert alert-info",
    2: "alert alert-success",
    3: "alert alert-warning",
    4: "alert alert-error",
  };

  return (
    <div role="alert" className={style[type]}>
      <span>{children}</span>
    </div>
  );
};

export default Alert;
