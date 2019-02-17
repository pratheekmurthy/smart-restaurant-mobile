import { baseUrl } from "../configs/env";

export const login = reqBody => {
  return new Promise((resolve, reject) => {
    console.log(baseUrl);
    fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqBody)
    })
      .then(resp => resp.json())
      .then(responseJson => {
        return resolve(responseJson);
      })
      .catch(e => {
        return reject(e);
      });
  });
};
