import { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const useListAddress = ({ listname }) => {
    const [listAddress, setListAddress] = useState(Object)
    const [loadingAddress, setLoadingAddress] = useState(false)
    const APIURL = 'https://api.thegraph.com/subgraphs/name/rabeles11/reviewdao'

    useEffect(() => {
        setLoadingAddress(true)
        fetchListAddress();
    }, []);

    const fetchListAddress = async () => {
        // console.log(listname)

        const GET_LISTADDRESS_BY_NAME = `
            query($name: String) {
                factoryContracts(where: {name: $name} ) {
                    newList
                }
            }
        `
        const client = new ApolloClient({
            uri: APIURL,
            cache: new InMemoryCache(),
        })

        client
            .query({
                query: gql(GET_LISTADDRESS_BY_NAME),
                variables: {
                    name: listname,
                },
            })
            // .then((data) => setListAddress(data.data.factoryContracts[0].newList))
            .then((data) => console.log(data.data.factoryContracts[0].newList))
            .then(setLoadingAddress(false))

            .catch((err) => {
                console.log('Error fetching data: ', err)
            })

        await client.query(GET_LISTADDRESS_BY_NAME).toPromise()
    }

    return [loadingAddress, listAddress]
}

export default useListAddress