import { Typography } from "@repo/ui/src/components/typography";
import { Metadata } from "next";
import { CreateIssueForm } from "@repo/components/src/forms/create-issue/components/create-issue-form";
import { BlockWrapper } from "@repo/components/src/wrappers/block-wrapper";

export const metadata: Metadata = {
  title: "Сообщить о проблеме или идее",
};

export default async function CreateIssuePage() {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <BlockWrapper className="flex flex-col gap-y-4 w-full !p-4">
        <Typography textSize="big" textColor="shark_white">
          Сообщить о проблеме или идее
        </Typography>
      </BlockWrapper>
      <CreateIssueForm />
    </div>
  )
}