import React, { useState } from "react";
import IndexedDb from "./IndexedDb";
// import users from "../../DB/sample.json";
import { openDB } from "idb";
import { users } from "../api/api";
import style from "./IDB.module.css";
import { Button, Card, Typography } from "@mui/material";

const Test = () => {
   const [download, setDownload] = useState<boolean>(true);
   const [date, setDate] = useState<string | number | undefined>();
   const [click, setClick] = useState<boolean>(false);
   // const users: object[] = [];

   const handleClick = () => {
      const downloadDate = new Date().toLocaleTimeString();
      const errorName = "Данное имя базы данных существует";

      const runIndexDb = async () => {
         const dbName = "usersDB";
         const isExisting = (await window.indexedDB.databases())
            .map((db) => db.name)
            .includes(dbName);
         if (isExisting === false) {
            const indexedDb = new IndexedDb(dbName);
            await indexedDb.createObjectStore(["users"]);
            await indexedDb.putValue("users", { name: "Alex" });
            await indexedDb.putBulkValue("users", users);
            // await indexedDb.getValue("books", 1);
            await indexedDb.getAllValue("users");
            // await indexedDb.deleteValue("books", 1);
            setDownload(false);
         } else {
            console.log(errorName);
         }
         setDownload(false);
         setDate(downloadDate);
      };
      runIndexDb();
   };

   const getAllUsersData = async () => {
      const db = await openDB("usersDB", 1);
      const tx = db.transaction("users", "readonly");
      const store = tx.objectStore("users");
      const result = await store.getAll();
      console.log("Get All Data", JSON.stringify(result));
      setClick(true);
   };

   return (
      <>
         <Card sx={{ padding: 3 }}>
            {download ? (
               <Button
                  sx={{ margin: 1 }}
                  color={"primary"}
                  variant={"outlined"}
                  onClick={handleClick}
               >
                  Загрузить данные по API
               </Button>
            ) : (
               <h3>Данные загружены в {date}</h3>
            )}
            <Button
               color={"primary"}
               sx={{ margin: 1 }}
               variant={"outlined"}
               onClick={getAllUsersData}
            >
               Получить все данные из БД
            </Button>
         </Card>
         <div className={style.usersContainer}>
            {" "}
            {click ? (
               users.map((u: any) => {
                  return (
                     <div className={style.container}>
                        <div className={style.info}>
                           <div
                              className={style.user}
                           >{`User: ${u.seller.firstName} ${u.seller.lastName}`}</div>
                           <div> {`Last Action: ${u.lastAction}`}</div>
                           <div> {`Email: ${u.seller.email}`} </div>
                        </div>
                     </div>
                  );
               })
            ) : (
               <Typography sx={{ paddingTop: 2, fontSize: 20 }}>
                  Нет данных
               </Typography>
            )}
         </div>
      </>
   );
};

export default Test;
