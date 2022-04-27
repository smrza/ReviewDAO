import { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const useListItems = ({ addr }) => {
    const [listItems, setListItems] = useState(Object)
    const APIURL = 'https://api.thegraph.com/subgraphs/name/rabeles11/reviewdao'

    useEffect(() => {
        fetchListItems();
    }, []);

    const fetchListItems = async () => {
        console.log(`addr: ${addr}`)

        const GET_LISTITEMS = `
            query($address: Bytes) {
                factoryContracts(where:{newList: $address}){
                    name
                    baseUri
                }
                    listEntities(where:{address: $address}) {
                    name
                    address
                }
            }
        `

        const client = new ApolloClient({
            uri: APIURL,
            cache: new InMemoryCache(),
        })

        client
            .query({
                query: gql(GET_LISTITEMS),
                variables: {
                    address: addr,
                },
            })
            // .then((data) => setListItems(data.data.listEntities))
            .then((data) => console.log(data.data.listEntities))

            .catch((err) => {
                console.log('Error fetching data: ', err)
            })

        await client.query(GET_LISTITEMS).toPromise()
    }

    return listItems
}

export default useListItems