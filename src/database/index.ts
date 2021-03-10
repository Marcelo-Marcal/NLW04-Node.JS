import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (): Promise<Connection> => {
  //Todas as informações do ormconfig
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    //Vai pegar todas as informações 
    Object.assign(defaultOptions, {
      database: process.env.NODE_ENV === "test" 
      ? "./src/database/database.test.sqlite" 
      : defaultOptions.database,
    })
  );
};