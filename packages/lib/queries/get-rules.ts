'use server';

import { Tables } from '@repo/types/entities/gen-supabase';
import { createClient } from '@repo/shared/api/supabase-client';

export type RulesSectionData<T> = {
  categoryTitle: string;
  content: T[];
};

export type RulesSections = {
  game: RulesSectionData<Tables<'landing_rule_content'>>
  chat: RulesSectionData<Tables<'landing_rule_content'>>,
  based: RulesSectionData<Tables<'landing_rule_content'>>,
  terms: RulesSectionData<Tables<'landing_termin_content'>>
}

export async function getRules(): Promise<RulesSections> {
  const api = createClient();
  
  const { data: termsData, error } = await api.from('landing_termin_content').select();
  
  if (error) {
    throw new Error(error.message);
  }
  
  const terms: Pick<RulesSections, "terms">["terms"] = {
    categoryTitle: 'Терминология',
    content: termsData,
  };
  
  const ruleTypes: [ keyof RulesSections, string ][] = [
    [ 'chat', 'Правила чата' ],
    [ 'game', 'Игровые правила' ],
    [ 'based', 'Основные правила проекта' ],
  ];
  
  const rules = await Promise.all(ruleTypes.map(async([ table, title ]) => {
    const { data, error } = await api
    .from('landing_rule_content')
    .select()
    .eq('rule_list_id', table);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return { categoryTitle: title, content: data };
  }));
  
  return { chat: rules[0], game: rules[1], based: rules[2], terms };
}