import React, { FC, useEffect, Fragment, useState } from 'react'
import {
  useRuntime,
  SessionUnauthorized,
  Session,
  SessionForbidden,
  canUseDOM,
} from 'vtex.render-runtime'

import { getSession } from './modules/session'

type ContentVisibility = 'visible' | 'hidden'

const useRedirect = (condition: boolean, path: string) => {
  const { navigate } = useRuntime()

  useEffect(() => {
    if (!condition) {
      return
    }

    const url = canUseDOM
      ? window.location.pathname + window.location.hash
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global as any).__pathname__

    navigate({
      to: `${path}?returnUrl=${encodeURIComponent(url)}`,
    })
  }, [condition, navigate, path])
}

type SessionResponse = Session | SessionUnauthorized | SessionForbidden

const useSessionResponse = () => {
  const [session, setSession] = useState<SessionResponse>()
  const sessionPromise = getSession()

  useEffect(() => {
    if (!sessionPromise) {
      return
    }

    sessionPromise.then(sessionResponse => {
      const response = sessionResponse.response as SessionResponse

      setSession(response)
    })
  }, [sessionPromise])

  return session
}

const isSessionUnauthorized = (
  session: SessionResponse | undefined
): session is SessionUnauthorized =>
  (session as SessionUnauthorized)?.type?.toLowerCase() === 'unauthorized'

const isSessionForbidden = (
  session: SessionResponse | undefined
): session is SessionForbidden =>
  (session as SessionForbidden)?.type?.toLowerCase() === 'forbidden'

interface Props {
  redirectPath: string
  forbiddenRedirectPath: string
  defaultContentVisibility: ContentVisibility
}

const isProfileAllowed = (sessionResponse: SessionResponse | undefined) => {
  if (sessionResponse == null) {
    return null
  }

  const hasAccessToTradePolicy = (sessionResponse as Session).namespaces?.store
    ?.channel
  const isLoggedIn = (sessionResponse as Session).namespaces?.profile?.email

  if (hasAccessToTradePolicy) {
    return 'authorized'
  }
  if (isLoggedIn) {
    return 'forbidden'
  }
  return 'unauthorized'
}

const ChallengeTradePolicyCondition: FC<Props> = ({
  redirectPath = '/login',
  forbiddenRedirectPath = redirectPath,
  defaultContentVisibility = 'visible',
  children,
}) => {
  const sessionResponse = useSessionResponse()
  const isUnauthorized = isSessionUnauthorized(sessionResponse)
  const isForbidden = isSessionForbidden(sessionResponse)
  const profileCondition = isProfileAllowed(sessionResponse)

  useRedirect(
    isUnauthorized === true || profileCondition === 'unauthorized',
    redirectPath
  )
  useRedirect(
    isForbidden === true || profileCondition === 'forbidden',
    forbiddenRedirectPath
  )

  const defaultHidden =
    defaultContentVisibility === 'hidden' && sessionResponse == null

  if (
    defaultHidden ||
    isUnauthorized === true ||
    isForbidden === true ||
    profileCondition === 'unauthorized' ||
    profileCondition === 'forbidden'
  ) {
    return null
  }

  return <Fragment>{children}</Fragment>
}

export default React.memo(ChallengeTradePolicyCondition)
