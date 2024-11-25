import { createClient } from '@repo/lib/utils/api/server.ts';

export async function getForumStats() {
  let usersRegisteredForum: number;
  let usersRegisteredServer: number;
  let topicsCreatedToday: number;
  let topicsCreatedAll: number;
  
  const api = createClient();
  
  const { count: usersForum } = await api
  .from('users')
  .select('*', {
    count: 'exact', head: true,
  });
  
  const { count: usersServer } = await api
  .from('AUTH')
  .select('*', {
    count: 'exact', head: true,
  });
  
  const { count: topicsToday } = await api
  .from('threads')
  .select('*', {
    count: 'exact', head: true,
  })
  .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  
  const { count: topicsAll } = await api
  .from('threads')
  .select('*', {
    count: 'exact', head: true,
  })
  
  usersRegisteredForum = usersForum || 0;
  usersRegisteredServer = usersServer || 0;
  topicsCreatedToday = topicsToday || 0;
  topicsCreatedAll = topicsAll || 0
  
  return { usersRegisteredForum, usersRegisteredServer, topicsCreatedToday, topicsCreatedAll };
}