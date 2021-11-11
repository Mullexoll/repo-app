import axios from "axios";
import React from "react";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Button } from "@mui/material";
import { setInterval } from "timers";
import Rechart from "../RechartGraph/Rechart";

var AmazonCognitoIdentity = require("amazon-cognito-identity-js");
require("cross-fetch/polyfill");

var authenticationData = {
   Username: "mik@wmt.dk",
   Password: "123123q",
};
var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
   authenticationData
);
var poolData = {
   UserPoolId: "us-east-1_hpSQzqDya", // Your user pool id here
   ClientId: "67b53vmhf7har3bvbstcbthigf", // Your client id here
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var userData = {
   Username: "mik@wmt.dk",
   Pool: userPool,
};
var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
cognitoUser.authenticateUser(authenticationDetails, {
   onSuccess: function (result: any) {
      var accessToken = result.getAccessToken().getJwtToken();
      console.log(accessToken);
   },
   onFailure: function (err: any) {
      alert(err.message || JSON.stringify(err));
   },
});

const token =
   "eyJraWQiOiIwVk9BSnM0dXY2cGJDalFsUjdiTUc1aWNoUG51M1J1STlWN2ZwNlk2M1pNPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxZTY1OGJjZi1lYTZiLTQ4MzktYWY3Yy1lNDI2NWYwNzMyY2YiLCJldmVudF9pZCI6IjVhNGEzOGM5LTJhMGQtNGY2ZC1iM2Q0LTQ0NGEzZjcyZmRjZCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2MzY2MzQ1MzMsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX2hwU1F6cUR5YSIsImV4cCI6MTYzNjYzODEzMywiaWF0IjoxNjM2NjM0NTMzLCJqdGkiOiI4ZWZlMDhhYy0zNWJlLTQ5Y2UtYmYyZS0zMjkwODYwODRhZWUiLCJjbGllbnRfaWQiOiI2N2I1M3ZtaGY3aGFyM2J2YnN0Y2J0aGlnZiIsInVzZXJuYW1lIjoiMWU2NThiY2YtZWE2Yi00ODM5LWFmN2MtZTQyNjVmMDczMmNmIn0.H5HHZBNuGp2BFpm3ObobnHR2NvXGK6mR2oKYodIJLfVjvrrzmES4SVJ8PeRv0zp6JJ9QEmd2D5FNEgZKxgyq3s4peWK_MAcjw50yVm6hXpf3lji1YQvdRO90tp6LaPfVoO66oFZLIwe2iPnfAT81Iy7t7vi1OGBC4WA1YdLcSrm_oyVa9DzJDIv0ssMXz2sDYxaMLHj7CjnwuoZ7bOL0fZyMsGbSribSPxMsef39ZLR9JoX1e6G_er5K1ymDebws32CWXmEfP6ORrjX4oM4IbuEA9mcWsnedtkBQ1c6aSFjQq7CN1FiHfWXRQtHb6uz0b-O9BM8Vl5xzBHIe68wK4w";
const instance = axios.create({
   withCredentials: false,
   baseURL: "https://dev.prezentor.com/api/",
   headers: {
      Authorization: "Bearer " + token,
   },
});

const usersAPI = {
   async getUsers() {
      return instance.get(`reports/meetings`);
   },
};

let users: object[] = [];

const AlertMessage = () => {
   const [openAlert, setOpenAlert] = useState<boolean>(false);
   const [error, setError] = useState<string>();

   const handleClose = (reason: any) => {
      if (reason === "clickaway") {
         return;
      }
      setOpenAlert(false);
   };

   const handleClick = () => {
      setInterval(() => {
         usersAPI
            .getUsers()
            .then(async (response) => {
               users = [];
               users.push(...response.data);
            })
            .catch((error) => {
               setError((error as Error).message);
               console.log(error);
               setOpenAlert(true);
            });
      }, 300000);
   };

   return (
      <>
         <Rechart />
         <Button
            sx={{ margin: 1 }}
            color={"primary"}
            variant={"outlined"}
            onClick={handleClick}
         >
            Загрузить данные по API
         </Button>
         <Snackbar
            open={openAlert}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{
               vertical: "bottom",
               horizontal: "left",
            }}
         >
            <Alert onClose={handleClose} severity="error">
               {`${error}: Следующее обновление через 5 минут`}
            </Alert>
         </Snackbar>
      </>
   );
};

export { users };
export default AlertMessage;

// aws cognito-idp admin-initiate-auth --user-pool-id us-east-1_hpSQzqDya --client-id 67b53vmhf7har3bvbstcbthigf --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME=mik@wmt.dk,PASSWORD=123123q
