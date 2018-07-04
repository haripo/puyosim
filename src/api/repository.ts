import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import { Entry } from "./entity/Entry";


createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "admin",
  database: "test",
  entities: [
    Entry
  ],
  synchronize: true,
  logging: false
}).then(connection => {
  console.info('Connection created', connection)
}).catch(error => {
  console.error(error)
});

async function connect() {
  const option = await getConnectionOptions('rdbms');
  const dbCon = await createConnection(option);
  const res = await dbCon.getRepository(Entry).findOne({ id: 1 });
  console.log(res); // Users {id: 1,name: 'oh',email: 'taylor@example.com', password: ''}
}
