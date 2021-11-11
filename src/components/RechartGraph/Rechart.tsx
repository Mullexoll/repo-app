import React from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import {
   ResponsiveContainer,
   AreaChart,
   XAxis,
   YAxis,
   Area,
   Tooltip,
   CartesianGrid,
} from "recharts";
import { users } from "../api/api";
import style from "./Rechart.module.css";

interface DataApi {
   meetingDate: string;
}

// let data: object[] = [];

// for (let num = 30; num >= 0; num--) {
//    data.push({
//       date: subDays(new Date(), num).toISOString().substr(0, 10),
//       value: 1 + Math.random(),
//    });
// }

const Rechart = () => {
   const [click, setClick] = useState<boolean>(false);
   let [allUsers, setAllUsers] = useState<any>();

   const showGraphic = () => {
      setAllUsers(
         users.map((u: any) => ({
            date: u.meetingDate.split("").splice(0, 10).join(""),
            value: Math.floor(u.timeSpent % 60),
            time: u.meetingDate,
         }))
      );
      console.log("Called");

      setClick(true);
   };

   return (
      <>
         <div>
            {click ? (
               <Button
                  color={"primary"}
                  sx={{ margin: 1 }}
                  variant={"outlined"}
                  onClick={() => setClick(false)}
               >
                  Скрыть график
               </Button>
            ) : (
               <Button
                  color={"primary"}
                  sx={{ margin: 1 }}
                  variant={"outlined"}
                  onClick={showGraphic}
               >
                  Показать график
               </Button>
            )}
         </div>
         {click ? (
            <ResponsiveContainer
               className={style.container}
               width="90%"
               height={400}
            >
               <AreaChart data={allUsers}>
                  <defs>
                     <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                        <stop
                           offset="0%"
                           stopColor="#2451B7"
                           stopOpacity={0.4}
                        />
                        <stop
                           offset="75%"
                           stopColor="#2451B7"
                           stopOpacity={0.05}
                        />
                     </linearGradient>
                  </defs>

                  <Area dataKey="value" stroke="#2451B7" fill="url(#color)" />

                  <Area
                     type="monotone"
                     dataKey="time"
                     stroke="#8884d8"
                     fillOpacity={1}
                     fill="url(#colorUv)"
                  />

                  <XAxis dataKey="date" axisLine={false} tickLine={false} />

                  <YAxis
                     dataKey="value"
                     axisLine={false}
                     tickLine={false}
                     tickCount={8}
                     tickFormatter={(number) => `${number.toFixed(0)} min`}
                  />

                  <Tooltip />

                  <CartesianGrid opacity={0.1} vertical={false} />
               </AreaChart>
            </ResponsiveContainer>
         ) : (
            <div>График обновлён, нажмите "Показать График"</div>
         )}
      </>
   );
};

export default Rechart;
