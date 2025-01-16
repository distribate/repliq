import { Typography } from '@repo/landing-ui/src/typography.tsx';
import { RulesSectionData } from '@repo/lib/queries/get-rules.ts';
import { Tables } from '@repo/types/entities/gen-supabase.ts';

type RulesTerminItem = RulesSectionData<Tables<'landing_termin_content'>>
type RulesTerminItemContent = Tables<'landing_termin_content'>

export const RulesTerminItemContent = ({
  article_desc, article_title, id, section_id,
}: RulesTerminItemContent) => {
  return (
    <div className="flex flex-col mb-6 lg:mb-4">
      <div className="flex-col flex gap-1">
        <Typography className="text-project-color text-md md:text-lg">
          {id}{`)`}&nbsp;
          <span className="text-black dark:text-white font-semibold">{article_title}</span>
          {article_desc && (
            <span className="inline text-black dark:text-neutral-400">
							&nbsp;- {article_desc}
						</span>
          )}
        </Typography>
      </div>
    </div>
  );
};

export const RulesTerminItem = ({
  categoryTitle, content,
}: RulesTerminItem) => {
  if (!content) return null;
  return (
    <div
      id={categoryTitle}
      className="flex flex-col py-2 group md:py-4 px-2 md:px-4 border-2 border-[#454545] hover:duration-300 duration-300 rounded-[8px]"
    >
      <h1 className="text-gold text-xl md:text-4xl text-shadow-xl mb-6">
        {categoryTitle}
      </h1>
      {content.map(item =>
        <RulesTerminItemContent key={item.id} {...item} />)
      }
    </div>
  );
};