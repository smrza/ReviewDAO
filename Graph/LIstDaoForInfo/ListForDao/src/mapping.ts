import { BigInt } from "@graphprotocol/graph-ts"
import {
  ReviewDAOList,
  _Banished,
  _ChallengeModified,
  _ListingModified,
  _ListingStatus,
  _ResolveListing,
  _Withdrawal
} from "../generated/ReviewDAOList/ReviewDAOList"
import { ExampleEntity } from "../generated/schema"

export function handle_Banished(event: _Banished): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.hash = event.params.hash
  entity.whitelisted = event.params.whitelisted

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.baseUri(...)
  // - contract.challenges(...)
  // - contract.creator(...)
  // - contract.getRewardBalance(...)
  // - contract.listings(...)
  // - contract.name(...)
  // - contract.nameRegistered(...)
  // - contract.polls(...)
  // - contract.test(...)
}

export function handle_ChallengeModified(event: _ChallengeModified): void {}

export function handle_ListingModified(event: _ListingModified): void {}

export function handle_ListingStatus(event: _ListingStatus): void {}

export function handle_ResolveListing(event: _ResolveListing): void {}

export function handle_Withdrawal(event: _Withdrawal): void {}
