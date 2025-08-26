export interface SkillNode {
  id: string
  name: string
  level: number
  unlocked: boolean
  children?: SkillNode[]
}

export const skillsTree: SkillNode[] = [
  {
    id: 'basic',
    name: 'Basic Skills',
    level: 1,
    unlocked: true,
    children: [
      { id: 'balance', name: 'Balance', level: 1, unlocked: true },
      { id: 'throttle', name: 'Throttle Control', level: 2, unlocked: false }
    ]
  }
]

export const getSkillTree = (userId: string) => {
  return skillsTree
}

export const updateSkillProgress = (userId: string, skillId: string, progress: number) => {
  // Update skill progress logic
  return true
}

// Export SKILLS_DATABASE for backward compatibility
export const SKILLS_DATABASE = skillsTree