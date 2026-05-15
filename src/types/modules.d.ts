declare module '*.css'
declare module '../contexts/LangContext' {
  export const LanguageContext: import('react').Context<{ lang: string; setLang: (l: string) => void }>
  export function useLanguage(): { lang: string; setLang: (l: string) => void }
}
declare module '../components/PostCard' {
  const PostCard: import('react').FC<{ post: Record<string, unknown> }>
  export default PostCard
}
