/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/grid.json`.
 */
export type Grid = {
  "address": "5FfK29L2jUZGYqwE4sGsyKJdJ4tDE2wrbpzzYdR5EUH",
  "metadata": {
    "name": "grid",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "cancelTournament",
      "discriminator": [
        249,
        227,
        133,
        5,
        9,
        142,
        29,
        122
      ],
      "accounts": [
        {
          "name": "tournament",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  117,
                  114,
                  110,
                  97,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "tournament.organizer",
                "account": "tournament"
              },
              {
                "kind": "account",
                "path": "tournament.tournament_id",
                "account": "tournament"
              }
            ]
          }
        },
        {
          "name": "organizer",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "claimRefundSol",
      "discriminator": [
        8,
        82,
        5,
        144,
        194,
        114,
        255,
        20
      ],
      "accounts": [
        {
          "name": "tournament",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  117,
                  114,
                  110,
                  97,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "tournament.organizer",
                "account": "tournament"
              },
              {
                "kind": "account",
                "path": "tournament.tournament_id",
                "account": "tournament"
              }
            ]
          }
        },
        {
          "name": "playerRegistration",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "tournament"
              },
              {
                "kind": "account",
                "path": "player"
              }
            ]
          }
        },
        {
          "name": "solVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "tournament"
              }
            ]
          }
        },
        {
          "name": "player",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "createPlayerProfile",
      "discriminator": [
        74,
        49,
        165,
        71,
        60,
        87,
        254,
        50
      ],
      "accounts": [
        {
          "name": "playerProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "player"
              }
            ]
          }
        },
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createTournament",
      "discriminator": [
        158,
        137,
        233,
        231,
        73,
        132,
        191,
        68
      ],
      "accounts": [
        {
          "name": "platform",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "tournament",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  117,
                  114,
                  110,
                  97,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "organizer"
              },
              {
                "kind": "account",
                "path": "platform.tournament_count",
                "account": "platformState"
              }
            ]
          }
        },
        {
          "name": "organizer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "game",
          "type": "string"
        },
        {
          "name": "entryFee",
          "type": "u64"
        },
        {
          "name": "maxPlayers",
          "type": "u16"
        },
        {
          "name": "payoutBps",
          "type": {
            "vec": "u16"
          }
        },
        {
          "name": "paymentType",
          "type": {
            "defined": {
              "name": "paymentType"
            }
          }
        },
        {
          "name": "paymentMint",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "finalizeTournamentSol",
      "discriminator": [
        167,
        71,
        234,
        6,
        165,
        103,
        41,
        66
      ],
      "accounts": [
        {
          "name": "tournament",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  117,
                  114,
                  110,
                  97,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "tournament.organizer",
                "account": "tournament"
              },
              {
                "kind": "account",
                "path": "tournament.tournament_id",
                "account": "tournament"
              }
            ]
          }
        },
        {
          "name": "solVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "tournament"
              }
            ]
          }
        },
        {
          "name": "organizer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "winners",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "initializePlatform",
      "discriminator": [
        119,
        201,
        101,
        45,
        75,
        122,
        89,
        3
      ],
      "accounts": [
        {
          "name": "platform",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "treasury"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "platformFeeBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "joinTournamentSol",
      "discriminator": [
        217,
        243,
        78,
        20,
        75,
        198,
        184,
        66
      ],
      "accounts": [
        {
          "name": "tournament",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  117,
                  114,
                  110,
                  97,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "tournament.organizer",
                "account": "tournament"
              },
              {
                "kind": "account",
                "path": "tournament.tournament_id",
                "account": "tournament"
              }
            ]
          }
        },
        {
          "name": "playerRegistration",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "tournament"
              },
              {
                "kind": "account",
                "path": "player"
              }
            ]
          }
        },
        {
          "name": "solVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "tournament"
              }
            ]
          }
        },
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "platformState",
      "discriminator": [
        160,
        10,
        182,
        134,
        98,
        122,
        78,
        239
      ]
    },
    {
      "name": "playerProfile",
      "discriminator": [
        82,
        226,
        99,
        87,
        164,
        130,
        181,
        80
      ]
    },
    {
      "name": "playerRegistration",
      "discriminator": [
        245,
        199,
        242,
        232,
        93,
        39,
        206,
        161
      ]
    },
    {
      "name": "tournament",
      "discriminator": [
        175,
        139,
        119,
        242,
        115,
        194,
        57,
        92
      ]
    }
  ],
  "events": [
    {
      "name": "platformInitialized",
      "discriminator": [
        16,
        222,
        212,
        5,
        213,
        140,
        112,
        162
      ]
    },
    {
      "name": "playerJoined",
      "discriminator": [
        39,
        144,
        49,
        106,
        108,
        210,
        183,
        38
      ]
    },
    {
      "name": "playerProfileCreated",
      "discriminator": [
        221,
        30,
        180,
        224,
        136,
        253,
        108,
        70
      ]
    },
    {
      "name": "tournamentCreated",
      "discriminator": [
        102,
        32,
        240,
        45,
        52,
        64,
        97,
        0
      ]
    },
    {
      "name": "tournamentFinalized",
      "discriminator": [
        34,
        61,
        238,
        26,
        68,
        54,
        253,
        144
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "platformPaused",
      "msg": "Platform is currently paused."
    },
    {
      "code": 6001,
      "name": "invalidPlatformFee",
      "msg": "Invalid platform fee."
    },
    {
      "code": 6002,
      "name": "titleTooLong",
      "msg": "Title is too long."
    },
    {
      "code": 6003,
      "name": "gameNameTooLong",
      "msg": "Game name is too long."
    },
    {
      "code": 6004,
      "name": "invalidEntryFee",
      "msg": "Entry fee must be greater than zero."
    },
    {
      "code": 6005,
      "name": "invalidMaxPlayers",
      "msg": "Max players must be greater than one."
    },
    {
      "code": 6006,
      "name": "tooManyPlayers",
      "msg": "Too many players."
    },
    {
      "code": 6007,
      "name": "tooManyWinners",
      "msg": "Too many winners."
    },
    {
      "code": 6008,
      "name": "invalidPayoutSplit",
      "msg": "Payout basis points must sum to 10000."
    },
    {
      "code": 6009,
      "name": "tournamentNotOpen",
      "msg": "Tournament is not open."
    },
    {
      "code": 6010,
      "name": "tournamentNotCompleted",
      "msg": "Tournament is not completed."
    },
    {
      "code": 6011,
      "name": "tournamentFull",
      "msg": "Tournament is already full."
    },
    {
      "code": 6012,
      "name": "playerAlreadyJoined",
      "msg": "Player already joined this tournament."
    },
    {
      "code": 6013,
      "name": "invalidPaymentType",
      "msg": "Invalid payment type for this instruction."
    },
    {
      "code": 6014,
      "name": "unauthorizedOrganizer",
      "msg": "Only the organizer can perform this action."
    },
    {
      "code": 6015,
      "name": "winnerPayoutMismatch",
      "msg": "Winner count does not match payout split count."
    },
    {
      "code": 6016,
      "name": "invalidWinnerAccount",
      "msg": "Winner account does not match submitted winner address."
    },
    {
      "code": 6017,
      "name": "winnerNotRegistered",
      "msg": "Winner must be a registered player."
    },
    {
      "code": 6018,
      "name": "tournamentAlreadyCompleted",
      "msg": "Tournament has already been finalized."
    },
    {
      "code": 6019,
      "name": "mathOverflow",
      "msg": "Math overflow."
    }
  ],
  "types": [
    {
      "name": "paymentType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "sol"
          },
          {
            "name": "spl"
          }
        ]
      }
    },
    {
      "name": "platformInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "platformFeeBps",
            "type": "u16"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "platformState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "tournamentCount",
            "type": "u64"
          },
          {
            "name": "platformFeeBps",
            "type": "u16"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "paused",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "playerJoined",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tournament",
            "type": "pubkey"
          },
          {
            "name": "player",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "playerProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player",
            "type": "pubkey"
          },
          {
            "name": "tournamentsPlayed",
            "type": "u64"
          },
          {
            "name": "wins",
            "type": "u64"
          },
          {
            "name": "earnings",
            "type": "u64"
          },
          {
            "name": "trophies",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "playerProfileCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "playerRegistration",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tournament",
            "type": "pubkey"
          },
          {
            "name": "player",
            "type": "pubkey"
          },
          {
            "name": "paidAmount",
            "type": "u64"
          },
          {
            "name": "joinedAt",
            "type": "i64"
          },
          {
            "name": "refunded",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "tournament",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "organizer",
            "type": "pubkey"
          },
          {
            "name": "tournamentId",
            "type": "u64"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "game",
            "type": "string"
          },
          {
            "name": "entryFee",
            "type": "u64"
          },
          {
            "name": "maxPlayers",
            "type": "u16"
          },
          {
            "name": "currentPlayers",
            "type": "u16"
          },
          {
            "name": "paymentMint",
            "type": "pubkey"
          },
          {
            "name": "paymentType",
            "type": {
              "defined": {
                "name": "paymentType"
              }
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "tournamentStatus"
              }
            }
          },
          {
            "name": "prizePool",
            "type": "u64"
          },
          {
            "name": "players",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "winners",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "payoutBps",
            "type": {
              "vec": "u16"
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "tournamentCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tournament",
            "type": "pubkey"
          },
          {
            "name": "organizer",
            "type": "pubkey"
          },
          {
            "name": "tournamentId",
            "type": "u64"
          },
          {
            "name": "title",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "tournamentFinalized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tournament",
            "type": "pubkey"
          },
          {
            "name": "winners",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "prizePool",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "tournamentStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "open"
          },
          {
            "name": "active"
          },
          {
            "name": "completed"
          },
          {
            "name": "cancelled"
          }
        ]
      }
    }
  ]
};
