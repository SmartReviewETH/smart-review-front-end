export const smartReviewContractAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "smts_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    name: "StringsInsufficientHexLength",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "smartReviewId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "smartReveiwPhase",
        type: "uint256",
      },
    ],
    name: "BountyAdd",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "smartReviewId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reviewId",
        type: "uint256",
      },
    ],
    name: "ReviewComplete",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "SmartReviewId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ReviewId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address payable",
        name: "issuer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reviewFileHash",
        type: "string",
      },
    ],
    name: "ReviewPublished",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "nowTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "smartReviewId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "smartReveiwPhase",
        type: "uint256",
      },
    ],
    name: "SmartReviewCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address payable[]",
        name: "issuers",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ipHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "requirementsHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bountyAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "smartReviewId",
        type: "uint256",
      },
    ],
    name: "SmartReviewPublished",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "AllSmartReviews",
    outputs: [
      {
        internalType: "string",
        name: "ipHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "requirementsHash",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "enum SmartReviewContract.SmartReveiwPhases",
        name: "phase",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "bountyAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentBalance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "ReviewsMapping",
    outputs: [
      {
        internalType: "address payable",
        name: "issuer",
        type: "address",
      },
      {
        internalType: "string",
        name: "reviewFileHash",
        type: "string",
      },
      {
        internalType: "enum SmartReviewContract.ReveiwPhases",
        name: "phase",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "SmartReviewsMapping",
    outputs: [
      {
        internalType: "string",
        name: "ipHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "requirementsHash",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "enum SmartReviewContract.SmartReveiwPhases",
        name: "phase",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "bountyAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentBalance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "smartReviewId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "addBountyToSmartReview",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reviewId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "smartReviewId",
        type: "uint256",
      },
    ],
    name: "completeReview",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "smartReviewId",
        type: "uint256",
      },
    ],
    name: "completeSmartReview",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "smartReviewId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reviewId",
        type: "uint256",
      },
    ],
    name: "getReviewById",
    outputs: [
      {
        components: [
          {
            internalType: "address payable",
            name: "issuer",
            type: "address",
          },
          {
            internalType: "string",
            name: "reviewFileHash",
            type: "string",
          },
          {
            internalType: "enum SmartReviewContract.ReveiwPhases",
            name: "phase",
            type: "uint8",
          },
        ],
        internalType: "struct SmartReviewContract.Review",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "smartReviewId",
        type: "uint256",
      },
    ],
    name: "getReviewsBySmartReviewId",
    outputs: [
      {
        components: [
          {
            internalType: "address payable",
            name: "issuer",
            type: "address",
          },
          {
            internalType: "string",
            name: "reviewFileHash",
            type: "string",
          },
          {
            internalType: "enum SmartReviewContract.ReveiwPhases",
            name: "phase",
            type: "uint8",
          },
        ],
        internalType: "struct SmartReviewContract.Review[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "smartReviewId",
        type: "uint256",
      },
    ],
    name: "getReviewsCountBySmartReviewId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "getSmartReviewById",
    outputs: [
      {
        components: [
          {
            internalType: "address payable[]",
            name: "issuers",
            type: "address[]",
          },
          {
            internalType: "string",
            name: "ipHash",
            type: "string",
          },
          {
            internalType: "string",
            name: "requirementsHash",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "enum SmartReviewContract.SmartReveiwPhases",
            name: "phase",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "bountyAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentBalance",
            type: "uint256",
          },
        ],
        internalType: "struct SmartReviewContract.SmartReview",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSmartReviewsCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "reviewFileHash",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "smartReviewId",
        type: "uint256",
      },
    ],
    name: "publishReview",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable[]",
        name: "issuers",
        type: "address[]",
      },
      {
        internalType: "string",
        name: "ipHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "requirementsHash",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bountyAmount",
        type: "uint256",
      },
    ],
    name: "publishSmartReview",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "smts",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
