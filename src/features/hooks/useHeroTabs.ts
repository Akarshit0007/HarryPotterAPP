import { useState } from 'react';

export type TabType = 'Hogwarts Staff' | 'House' | 'Spells';

export function useHeroTabs() {
  const [activeTab, setActiveTab] =useState<TabType>('House');

  const tabs: TabType[] = ['Hogwarts Staff', 'House', 'Spells'];

  return {
    activeTab,
    setActiveTab,
    tabs,
  };
}

export const cards:string[] =['Gryffindor' , 'RavenClaw' , 'HufflePuff' , 'Slytherin'];
