import { useState } from 'react';

export type TabType =  'House' | 'Spells';

export function useHeroTabs() {
  const [activeTab, setActiveTab] =useState<TabType>('House');

  const tabs: TabType[] = ['House', 'Spells'];

  return {
    activeTab,
    setActiveTab,
    tabs,
  };
}

export const cards:string[] =['Gryffindor' , 'RavenClaw' , 'HufflePuff' , 'Slytherin'];
