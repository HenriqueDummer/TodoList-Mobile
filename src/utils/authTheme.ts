export const colors = {
  background: '#050505',
  surface: '#1A1A1A',
  border: '#263244',
  text: '#FFFFFF',
  mutedText: '#C6D4E5',
  placeholder: '#8390A8',
  icon: '#7D8CA6',
  purple: '#A020F0',
  blue: '#2F80ED',
  error: '#FF6B6B',

  // prioridades
  highBg:     '#2D1515',
  highText:   '#FF6B6B',
  mediumBg:   '#2D2515',
  mediumText: '#F0A500',
  lowBg:      '#152D1A',
  lowText:    '#4CAF50',

  // status
  completed:  '#4CAF50',
  pending:    '#A020F0',

  // categorias
  categoryWork:     '#2F80ED',
  categoryPersonal: '#4CAF50',
  categoryShopping: '#F0A500',
  categoryHealth:   '#FF6B6B',
  categoryStudy:    '#A020F0',
} as const

export const authGradientColors = [colors.purple, colors.blue] as const
