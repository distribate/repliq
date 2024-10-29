export type StatsRequest = {
	uuid?: string,
	nickname: string
}

export type ResponseType<T> = {
	errorMessage: string,
	isSuccess: boolean,
	errorCode: number,
	data: T
}