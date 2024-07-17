import { CreateThreadForm } from "@repo/components/src/forms/create-thread/components/create-thread-form.tsx";

export default async function CreateThreadPage() {
	return (
		<div className="flex flex-col w-full">
			<CreateThreadForm/>
		</div>
	)
}