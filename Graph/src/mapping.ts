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
import { ListEntity,Challange,ListingStatus } from "../generated/schema"

export function handle_Banished(event: _Banished): void {
  let list = ListEntity.load(event.params.hash.toHexString())

  if (!list) {
    list = new ListEntity(event.params.hash.toHexString())
  }

  list.whitelisted = event.params.whitelisted

  list.save()
}

export function handle_ChallengeModified(event: _ChallengeModified): void {
  let challenge = Challange.load(event.params.id.toHexString())

  if (!challenge) {
    challenge = new Challange(event.params.id.toHexString())
  }

  challenge.challangerReward = event.params.challengerReward
  challenge.listingStake = event.params.listingStake
  challenge.challangerStake = event.params.challengerStake
  challenge.votePrice = event.params.votePrice
  challenge.timer = event.params.timer
  challenge.challenger = event.params.challenger

  challenge.save()
}

export function handle_ListingModified(event: _ListingModified): void {
  let list = ListEntity.load(event.params.hash.toHexString())

  if (!list) {
    list = new ListEntity(event.params.hash.toHexString())
  }

  list.hash = event.params.hash
  list.name = event.params.name
  list.whitelisted = event.params.whitelisted
  list.baseUri = event.params.baseUri
  list.creator = event.params.creator
  list.stake = event.params.stake
  list.challangerReward = event.params.challengerReward
  list.timer = event.params.timer
  list.challangeId = event.params.challengeId
  list.challanged = event.params.challenged
  list.statusId = event.params.statusId

  list.save()
}

export function handle_ListingStatus(event: _ListingStatus): void {
  let status = ListingStatus.load(event.params.id.toHexString())

  if (!status) {
    status = new ListingStatus(event.params.id.toHexString())
  }

  status.votes = event.params.votes

  status.save()

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

export function handle_Withdrawal(event: _Withdrawal): void {}
