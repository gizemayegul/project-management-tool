import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_SERVER_URL;
import { Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response: any = await axios.post(`${API_URL}/api/signup`, {
        email: email,
        password: password,
        name: name,
      });
      //   console.log(response);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.response.data.message);
      }
    }

    setName("");
    setPassword("");
    setEmail("");
  };

  return (
    <div>
      <h1>Signup Page</h1>
      <form onSubmit={submitHandler}>
        <label htmlFor="name">
          Name
          <input
            className="border-2"
            name="name"
            type="text"
            value={name}
            onChange={(e: React.FormEvent<HTMLInputElement>): void =>
              setName((e.target as HTMLInputElement).value)
            }
          />
        </label>
        <label htmlFor="email">
          Email
          <input
            className="border-2"
            name="email"
            type="email"
            value={email}
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              setEmail((e.target as HTMLInputElement).value);
            }}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            className="border-2"
            name="password"
            type="password"
            value={password}
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              setPassword((e.target as HTMLInputElement).value);
            }}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {error && (
        <div>
          <h1>{error}</h1>
          <h2>
            want to <Link to="/login">login</Link> ?
          </h2>
        </div>
      )}
    </div>
  );
}
