import React, { FC, useState, useEffect, ComponentType } from 'react'
import {
  SessionPromise,
  Session,
  SessionUnauthorized,
} from 'vtex.render-runtime'

interface WithSession {
  sesion: Session | SessionUnauthorized
}

export interface InjectedWithSessionProps {
  session: Session | SessionUnauthorized
}

const withSession = <P extends object>(
  WrappedComponent: ComponentType<P>
): FC<P & WithSession> => {
  const WrappedComponentWithSession: FC = (props: Record<string, unknown>) => {
    const [session, setSession] = useState<Session | SessionUnauthorized>()

    const sessionPromise =
      window &&
      (window as any).__RENDER_8_SESSION__ &&
      (window as any).__RENDER_8_SESSION__.sessionPromise
        ? ((window as any).__RENDER_8_SESSION__.sessionPromise as Promise<
            SessionPromise
          >)
        : null

    useEffect(() => {
      if (!sessionPromise) {
        return
      }

      sessionPromise.then(sessionResponse => {
        setSession(sessionResponse.response)
      })
    }, [sessionPromise])

    if (session === undefined) {
      return null
    }

    return <WrappedComponent {...(props as P)} session={session} />
  }

  return WrappedComponentWithSession
}

export default withSession
