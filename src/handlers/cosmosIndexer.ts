import { SearchTxQuery } from "@cosmjs/stargate/build/search";

export type PolymerData = {
  gasUsed: bigint;
  hash: string;
  height: number;
}

async function fetchGraphQL(
  query: string,
  variables: Record<string, any>
) {
  return fetch(process.env.POLY_INDEXER_URL ?? "http://localhost:8080/v1/graphql", {
    method: 'POST',
    body: JSON.stringify({
      query: query,
      variables,
    })
  })
}

export async function getCosmosPolymerData(query: SearchTxQuery, eventType: string): Promise<PolymerData | null> {
  const operation = `
  query Query($spec: jsonb) {
    transaction(where: {logs: {_contains: $spec}}) {
      gas_used
      
      hash
      height
    }    
  }
`;

  if (typeof query === 'string') {
    throw new Error('Polymer tx search does not support string queries')
  }

  // remove the prefix `${eventType}.` from each key in the query of type SearchTxQuery
  query = query.map(({key, value}) => {
    return {key: key.startsWith(eventType) ? key.slice(eventType.length + 1) : key, value: value.toString()}
  })

  let spec = [
    {
      "events": [
        {
          "type": eventType,
          "attributes": query
        }
      ]
    }
  ]

  console.log(`Searching for tx with query: ${JSON.stringify(query)} and spec: ${JSON.stringify(spec)}`)
  const gqRes = await fetchGraphQL(operation, {spec})
  const data = await gqRes.json()
  if (data.error) {
    throw new Error(`Polymer tx search failed for query ${JSON.stringify(query)} with error: ${data.error}`)
  }

  if (data.errors) {
    throw new Error(`Polymer tx search failed for query ${JSON.stringify(query)} with errors: ${JSON.stringify(data.errors)}`)
  }

  let transactions = data.data?.transaction
  if (transactions.length > 1) {
    throw new Error(`Multiple txs found for query: ${JSON.stringify(query)}`);
  }

  if (transactions.length == 1) {
    return {
      gasUsed: BigInt(transactions[0].gas_used),
      hash: transactions[0].hash,
      height: transactions[0].height,
    }
  }
  return null
}