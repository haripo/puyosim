import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import { Entry } from "./entity/Entry";



async function connect() {
  const option = await getConnectionOptions('rdbms');
  const dbCon = await createConnection(option);
  const res = await dbCon.getRepository(Entry).findOne({ id: 1 });
  console.log(res); // Users {id: 1,name: 'oh',email: 'taylor@example.com', password: ''}
}
