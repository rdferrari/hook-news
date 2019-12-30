import React from "react";
import useFormValidation from "./useFormValidation";
import validateLogin from "./validateLogin";
import firebase from "../../firebase";

import { Link } from "react-router-dom";

const INITIAL_STATE = {
  name: "",
  email: "",
  password: ""
};

function Login(props) {
  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    isSubmiting
  } = useFormValidation(INITIAL_STATE, validateLogin, autheticateUser);
  const [login, setLogin] = React.useState(true);
  const [firebaseError, setFirebaseError] = React.useState(null);

  async function autheticateUser() {
    const { name, email, password } = values;

    try {
      login
        ? await firebase.login(email, password)
        : await firebase.register(name, email, password);
      props.history.push("/");
    } catch (err) {
      console.error("Authentication error", err);
      setFirebaseError(err.message);
    }
  }

  return (
    <div>
      <h2 className="mv3">{login ? "Login" : "Create Account"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-column">
        {!login && (
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            name="name"
            value={values.name}
            type="text"
            placeholder="Your name"
            autoComplete="off"
          />
        )}
        <input
          onChange={handleChange}
          onBlur={handleBlur}
          name="email"
          className={errors.email && "error-input"}
          value={values.email}
          type="email"
          placeholder="Your email"
          autoComplete="off"
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
        <input
          onChange={handleChange}
          onBlur={handleBlur}
          name="password"
          className={errors.password && "error-input"}
          value={values.password}
          type="password"
          placeholder="Choose a secure password"
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
        {firebaseError && <p className="error-text">{firebaseError}</p>}
        <div className="flex mt3">
          <button
            type="submit"
            className="button pointer mr2"
            disabled={isSubmiting}
            style={{ background: isSubmiting ? "grey" : "orange" }}
          >
            Submit
          </button>
          <button
            type="button"
            className="pointer button"
            onClick={() => setLogin(prevLogin => !prevLogin)}
          >
            {login ? "need to create an account?" : "already have an account?"}
          </button>
        </div>
      </form>
      <div className="forgot-password">
        <Link to="/forgot">Forgot password?</Link>
      </div>
    </div>
  );
}

export default Login;
