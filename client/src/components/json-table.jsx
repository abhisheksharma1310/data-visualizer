import * as React from "react";
import { JsonToTable } from "react-json-to-table";
//import { useGetPokemonByNameQuery } from "./services/pokemon";
import { useGetSerialDataQuery } from "../services/serialdata";

export default function JsonTable() {
  // Using a query hook automatically fetches data and returns query values
  //const { data, error, isLoading } = useGetPokemonByNameQuery("bulbasaur");
  const { data, error, isLoading } = useGetSerialDataQuery();
  console.log(error);
  // Individual hooks are also accessible under the generated endpoints:
  // const { data, error, isLoading } = pokemonApi.endpoints.getPokemonByName.useQuery('bulbasaur')

  return (
    <div className="App">
      {error ? (
        <>
          Oh no, there was an error: {JSON.stringify(error)}
          <JsonToTable json={error} />
        </>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <>
          <h3>{data.species.name}</h3>
          <img src={data.sprites.front_shiny} alt={data.species.name} />
        </>
      ) : null}
    </div>
  );
}
