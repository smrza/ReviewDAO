const ABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "newList",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "hash",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "baseUri",
                "type": "string"
            }
        ],
        "name": "_NewList",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "allLists",
        "outputs": [
            {
                "internalType": "contract ReviewDAOList[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "nameHash_",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "name_",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "baseUri_",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "creator_",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token_",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "ReviewDAO_",
                "type": "address"
            }
        ],
        "name": "createList",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "nameHash_",
                "type": "bytes32"
            }
        ],
        "name": "getList",
        "outputs": [
            {
                "internalType": "contract ReviewDAOList",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "nameHash_",
                "type": "bytes32"
            }
        ],
        "name": "getListAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

module.exports.ABI = ABI
