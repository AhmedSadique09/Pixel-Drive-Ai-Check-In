import { lazy, Suspense, type ComponentType } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SCREEN_ROUTES } from './routes'

// Screens are discovered by folder so a missing screen simply redirects home.
const modules = import.meta.glob<{ default: ComponentType }>('./screens/*/*.tsx')

const routes = SCREEN_ROUTES.flatMap(({ path, folder }) => {
  const loader = modules[`./screens/${folder}/${folder}.tsx`]
  return loader ? [{ path, Component: lazy(loader) }] : []
})

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {routes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
