import { BigInt } from "@graphprotocol/graph-ts"
import {
  ReviewDAOListFactory,
  _NewList
} from "../generated/ReviewDAOListFactory/ReviewDAOListFactory"
import { FactoryContract, ListEntity } from "../generated/schema"
import { ReviewDAOList } from "../generated/templates"
import {
  _ListingModified,
  _Banished,
  _ChallengeModified,
  _ListingStatus,
  _ResolveListing,
  _Withdrawal

} from "../generated/templates/ReviewDAOList/ReviewDAOList"

export function handle_NewList(event: _NewList): void {

  let NewFactory = FactoryContract.load(event.params.hash.toHexString())       //adresa kontraktu

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!NewFactory) {
    NewFactory = new FactoryContract(event.params.hash.toHexString())
  }
  //let list = new ListEntity(event.params.hash.toHexString())

  //list.address = event.params.hash
  NewFactory.name = event.params.name
  NewFactory.baseUri = event.params.baseUri
  NewFactory.newList = event.params.newList
  //NewFactory.addressList = list.id
  //NewFactory.listyID = list.id
  ReviewDAOList.create(event.params.newList)


  NewFactory.save()
  //list.save()
}

export function handle_ListingModified(event:  _ListingModified): void{

  let NewList = ListEntity.load(event.params.hash.toHexString())

  if (!NewList) {
    NewList = new ListEntity(event.params.hash.toHexString())
  }

  NewList.name = event.params.name
  NewList.address = event.address
  NewList.baseUri = event.params.baseUri
  NewList.whitelisted = event.params.whitelisted
  NewList.challengeId = event.params.challengeId
  NewList.challenged = event.params.challenged
  NewList.challengerReward = event.params.challengerReward
  NewList.creator = event.params.creator
  NewList.stake = event.params.stake
  NewList.statusId = event.params.statusId
  NewList.timer = event.params.timer

  NewList.save()
}


export function handle_Banished(event: _Banished): void {
  let list = ListEntity.load(event.params.hash.toHexString())

  if (!list) {
    list = new ListEntity(event.params.hash.toHexString())
  }

  list.whitelisted = event.params.whitelisted

  list.save()
}

export function handle_ResolveListing(event: _ResolveListing): void {
  let list = ListEntity.load(event.params.hash.toHexString())

  if (!list) {
    list = new ListEntity(event.params.hash.toHexString())
  }

  list.whitelisted = event.params.whitelisted
  list.statusId = event.params.statsId

  list.save()
}


