'use server';

import 'server-only';
import ky from 'ky';
import { ResponseType, StatsRequest } from '../../../types/stats-types.ts';

type CMIUserEntity = {
  id: number;
  username?: string | null;
  balance?: number | null;
  totalPlayTime?: number | null;
  playerUuid?: string | null;
  userMeta?: string | null;
  displayName?: string | null;
}

type ReputationUserEntity = {
  id: number,
  uuid: string,
  reputationScore: string,
  acceptReputation: string
}

type UserWalletEntity = {
  id: number,
  uuid: string,
  points: number
}

type MainUserStats = {
  cmi: CMIUserEntity | null,
  reputation: ReputationUserEntity | null,
  wallet: UserWalletEntity | null
}

async function getUserReputation(uuid: string) {
  const searchParams = new URLSearchParams();
  searchParams.set('uuid', uuid);
  
  const res = await ky.get(`${process.env.ASP_NET_API_URL}/get-rep`, {
    searchParams,
    headers: {
      Authorization: `Bearer ${process.env.ASP_NET_API_SECRET}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!res.ok) {
    return null;
  }

  return await res.json<ResponseType<ReputationUserEntity> | null>()
}

async function getUserBelkoinWallet(uuid: string) {
  const searchParams = new URLSearchParams();
  searchParams.set('uuid', uuid);
  
  const res = await ky.get(`${process.env.ASP_NET_API_URL}/get-wallet/belkoin`, {
    searchParams,
    headers: {
      Authorization: `Bearer ${process.env.ASP_NET_API_SECRET}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!res.ok) {
    return null;
  }
  
  return await res.json<ResponseType<UserWalletEntity> | null>()
}

async function getUserCMIStats(nickname: string) {
  const searchParams = new URLSearchParams();
  searchParams.set('username', nickname);
  
  const res = await ky.get(`${process.env.ASP_NET_API_URL}/get-user`, {
    searchParams,
    headers: {
      Authorization: `Bearer ${process.env.ASP_NET_API_SECRET}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!res.ok) {
    return null;
  }

  return await res.json<ResponseType<CMIUserEntity> | null>()
}

export async function getMainUserState({
  nickname, uuid
}: StatsRequest): Promise<MainUserStats | null> {
  if (!uuid || !nickname) return null;

  const [cmi, reputation, wallet ] = await Promise.all([
    getUserCMIStats(nickname),
    getUserReputation(uuid),
    getUserBelkoinWallet(uuid)
  ])
  
  if (!cmi || !reputation || !wallet) return null;
  
  return {
    cmi: cmi.data, reputation: reputation.data, wallet: wallet.data
  }
}