import { createClient } from '@repo/lib/utils/api/server.ts';

export async function getForumStats() {
  let usersRegisteredForum: number | null;
  let usersRegisteredServer: number | null;
  let topicsCreatedToday: number | null;
  let topicsCreatedAll: number;
  
  const api = createClient();
  
  const { count: usersForum } = await api
  .from('users')
  .select('*', {
    count: 'exact', head: true,
  })
  
  const { count: usersServer } = await api
  .from('AUTH')
  .select('*', {
    count: 'exact', head: true,
  });
  
  const { count: topicsToday } = await api
  .from('threads')
  .select('*', {
    count: 'exact', head: true,
  });
  
  usersRegisteredForum = usersForum || null;
  usersRegisteredServer = usersServer || null;
  topicsCreatedToday = topicsToday || null;
  
  return { usersRegisteredForum, usersRegisteredServer, topicsCreatedToday };
}