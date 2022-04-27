import { BigInt, Bytes, store } from "@graphprotocol/graph-ts"
import {
  ReviewDAO,
  _NewListCreated,
  _NewProposal,
  _ProposalModified
} from "../generated/ReviewDAO/ReviewDAO"
import { PorposalList } from "../generated/schema"


export function handle_NewListCreated(event: _NewListCreated): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  store.remove('PorposalList',event.params.hash.toHexString())
  //NewPorposalList.created = true
}

export function handle_NewProposal(event: _NewProposal): void {

  let NewPorposalList = PorposalList.load(event.params.hash.toHexString())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!NewPorposalList) {
    NewPorposalList = new PorposalList(event.params.hash.toHexString())
  }

  NewPorposalList.baseUri = event.params.baseUri
  NewPorposalList.creator = event.params.creator
  NewPorposalList.votes = NewPorposalList.votes
  NewPorposalList.name = event.params.name
  //NewPorposalList.created = false

  NewPorposalList.save()

}

export function handle_ProposalModified(event: _ProposalModified): void {
  let NewPorposalList = PorposalList.load(event.params.hash.toHexString())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!NewPorposalList) {
    NewPorposalList = new PorposalList(event.params.hash.toHexString())
  }
  NewPorposalList.hash = event.params.hash
  NewPorposalList.name = event.params.name
  NewPorposalList.votes = event.params.votes  + BigInt.fromI32(1)
  //NewPorposalList.created = false

  NewPorposalList.save()

}
