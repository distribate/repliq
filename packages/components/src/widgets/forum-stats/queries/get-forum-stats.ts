import { createClient } from '@repo/lib/utils/supabase/server.ts';

export async function getForumStats() {
	const supabase = createClient();
	
	let usersRegisteredForum: number;
	let usersRegisteredServer: number;
	let topicsCreatedToday: number;
	let topicsCreatedAll: number;
	
	const [
		usersForum,
		usersServer,
		topicsToday
	] = await Promise.all([
		supabase
		.from("users")
		.select('*', {
			count: 'exact', head: true
		}),
		supabase
		.from("AUTH")
		.select('*', {
			count: 'exact', head: true
		}),
		supabase
		.from("threads")
		.select('*', {
			count: 'exact', head: true
		}),
	])
	
	if (topicsToday.error) throw topicsToday.error
	if (usersServer.error) throw usersServer.error;
	if (usersForum.error) throw usersForum.error;
	
	usersRegisteredForum = usersForum.count ? usersForum.count : 0;
	usersRegisteredServer = usersServer.count ? usersServer.count : 0;
	topicsCreatedToday = topicsToday.count ? topicsToday.count : 0;
	
	return { usersRegisteredForum, usersRegisteredServer, topicsCreatedToday }
}